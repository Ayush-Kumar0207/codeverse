require('dotenv').config({ path: __dirname + '/../.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use gemini-2.5-pro
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { responseMimeType: "application/json" } });

const systemPrompt = `You are a Senior Full-Stack Architect producing ultra-premium, beginner-friendly algorithmic explanations for 'CodeVerse'.
Your goal is to explain the algorithm at the HIGHEST level of depth, simplicity, and logic, ensuring even beginners can perfectly understand.
Always provide the optimal approach.

Output MUST be a raw JSON object with these exact keys:
"name": A catchy name starting with "Optimal (", e.g., "Optimal (Two Pointers)".
"description": A markdown string containing EXACTLY two sections:
    "### 🧠 The Core Concept\\n[Deep, relatable mental model and intuition]\\n\\n### 🛠️ Step-by-Step Logic\\n[Numbered list of step-by-step execution logic]"
"timeComplexity": Big O string, e.g., "O(N log N)".
"timeComplexityExplanation": One sentence simple explanation.
"spaceComplexity": Big O string, e.g., "O(1)".
"spaceComplexityExplanation": One sentence simple explanation.
`;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function processAlgorithm(title, topic, difficulty, retries = 3) {
    const prompt = `Solve this algorithm in an insanely beginner-friendly tone:\nTitle: ${title}\nTopic: ${topic}\nDifficulty: ${difficulty}`;
    
    try {
        const result = await model.generateContent({
             contents: [
                 { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] }
             ]
        });
        
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/) || responseText.match(/```\n([\s\S]*?)```/);
        const cleanJson = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        if (error.status === 429 && retries > 0) {
            console.log(`[!] Rate limit hit for "${title}". Waiting 30s before retry...`);
            await delay(30000);
            return processAlgorithm(title, topic, difficulty, retries - 1);
        }
        console.error(`❌ Error generating content for ${title}:`, error.message);
        return null;
    }
}

async function run() {
    console.log("🚀 Starting Massive Pedagogical Overhaul Automation...");
    
    const project = new Project();
    const filePath = 'C:/Users/kumar/Desktop/CodeVerse/client/data/algos/generated_striver_algos.ts';
    const sourceFile = project.addSourceFileAtPath(filePath);
    
    const declaration = sourceFile.getVariableDeclaration('generatedStriverAlgorithms');
    if (!declaration) throw new Error("Could not find generatedStriverAlgorithms array.");
    
    const arrayLiteral = declaration.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
    if (!arrayLiteral) throw new Error("Initializer is not an array literal.");
    
    const elements = arrayLiteral.getElements();
    let toProcess = [];
    
    for (const el of elements) {
        if (!el.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
        
        const titleProp = el.getProperty('title');
        const topicProp = el.getProperty('topic');
        const difficultyProp = el.getProperty('difficulty');
        const approachesProp = el.getProperty('approaches');
        
        if (!titleProp || !topicProp || !difficultyProp || !approachesProp) continue;
        
        const title = titleProp.getInitializer().getText().replace(/"/g, '');
        const topic = topicProp.getInitializer().getText().replace(/"/g, '');
        const difficulty = difficultyProp.getInitializer().getText().replace(/"/g, '');
        
        const approachesArray = approachesProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!approachesArray) continue;
        
        const firstApproach = approachesArray.getElements()[0];
        if (!firstApproach || !firstApproach.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
        
        const nameProp = firstApproach.getProperty('name');
        if (!nameProp) continue;
        
        const nameText = nameProp.getInitializer().getText().replace(/"/g, '');
        
        if (nameText === 'Standard Optimized') {
            toProcess.push({ node: firstApproach, title, topic, difficulty });
        }
    }
    
    console.log(`Found ${toProcess.length} algorithms needing overhaul. Processing...`);
    
    let successCount = 0;
    
    // Process sequentially to completely honor the strict 15 RPM free-tier limit. (4.1s per request)
    for (let i = 0; i < toProcess.length; i++) {
        const item = toProcess[i];
        console.log(`[${i+1}/${toProcess.length}] Overhauling: ${item.title}`);
        
        const data = await processAlgorithm(item.title, item.topic, item.difficulty);
        if (data) {
            const obj = item.node;
            
            ['name', 'description', 'timeComplexity', 'timeComplexityExplanation', 'spaceComplexity', 'spaceComplexityExplanation'].forEach(propName => {
                const prop = obj.getProperty(propName);
                if (prop) prop.remove();
            });
            
            obj.insertPropertyAssignment(0, { name: 'name', initializer: JSON.stringify(data.name || "Optimal") });
            obj.insertPropertyAssignment(1, { name: 'description', initializer: JSON.stringify(data.description || "") });
            obj.insertPropertyAssignment(2, { name: 'timeComplexity', initializer: JSON.stringify(data.timeComplexity || "O(N)") });
            
            if (data.timeComplexityExplanation) {
               obj.insertPropertyAssignment(3, { name: 'timeComplexityExplanation', initializer: JSON.stringify(data.timeComplexityExplanation) });
            }
            obj.insertPropertyAssignment(data.timeComplexityExplanation ? 4 : 3, { name: 'spaceComplexity', initializer: JSON.stringify(data.spaceComplexity || "O(1)") });
            
            if (data.spaceComplexityExplanation) {
               obj.insertPropertyAssignment(data.timeComplexityExplanation ? 5 : 4, { name: 'spaceComplexityExplanation', initializer: JSON.stringify(data.spaceComplexityExplanation) });
            }
            
            successCount++;
            await sourceFile.save(); // Save immediately per file to avoid data loss
        }
        
        // Wait 4000ms between each request (15 Requests per minute = 1 info every 4000ms)
        await delay(4100);
    }
    
    console.log(`\n🎉 Overhaul Complete! Successfully upgraded ${successCount}/${toProcess.length} algorithms!`);
}

run().catch(console.error);
