const fs = require('fs');
const path = require('path');
const runCode = require('../utils/runcode');
const Progress = require('../models/Progress');

const testcasesPath = path.join(__dirname, '../data/testcases.json');
let testcases = [];

try {
  const rawData = fs.readFileSync(testcasesPath, 'utf-8');
  testcases = JSON.parse(rawData);
} catch (error) {
  console.error('Failed to load test cases:', error);
}

exports.updateProgress = async (req, res) => {
  try {
    const { userId, exerciseId, code, language } = req.body;

    if (!userId || !exerciseId || !code || !language) {
      return res.status(400).json({ message: 'Missing required fields in request body.' });
    }

    const testcaseBlock = testcases.find(t => t.exerciseId === exerciseId);
    if (!testcaseBlock) {
      return res.status(404).json({ message: 'Test cases not found for this exercise.' });
    }

    let allPassed = true;

    for (const test of testcaseBlock.testCases) {
      const result = await runCode(code, language, test.input);
      const output = result?.stdout?.trim();
      const expected = test.output.trim();
      console.log(`Output: "${output}", Expected: "${expected}"`);
      if (output !== expected) {
        allPassed = false;
        break;
      }
    }

    if (!allPassed) {
      return res.status(400).json({ message: 'Some test cases failed.' });
    }

    const existing = await Progress.findOne({ userId, exerciseId });
    if (!existing) {
      await Progress.create({ userId, exerciseId, completed: true, completedAt: new Date() });
    }

    return res.json({ message: 'Exercise marked complete after passing all test cases.' });
    
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: 'Server error while updating progress.' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    
    const userProgress = await Progress.find({ userId, completed: true });
    
    return res.json({
      message: 'Progress retrieved successfully.',
      progress: userProgress
    });
    
  } catch (error) {
    console.error('Error getting progress:', error);
    return res.status(500).json({ message: 'Server error while retrieving progress.' });
  }
};