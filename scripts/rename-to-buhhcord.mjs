#!/usr/bin/env node

/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import path from 'path';

// Function to recursively get all files
function getAllFiles(dir, ignoreDirs = []) {
  const files = [];
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip ignored directories
      if (entry.isDirectory()) {
        if (ignoreDirs.some(ignoreDir => fullPath.includes(ignoreDir))) {
          continue;
        }
        files.push(...getAllFiles(fullPath, ignoreDirs));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Get all files in the project, excluding node_modules, dist, and .git
const ignoreDirs = ['node_modules', 'dist', '.git'];
const files = getAllFiles('.', ignoreDirs).filter(file => 
  !file.includes('scripts/rename-to-buhhcord.mjs')
);

console.log(`Found ${files.length} files to process`);

// Mapping for different case variations
const replacements = [
  { from: 'Vencord', to: 'Buhhcord' },
  { from: 'vencord', to: 'buhhcord' },
  { from: 'VENCORD', to: 'BUHHCORD' }
];

// Process each file
let modifiedFiles = 0;
for (const file of files) {
  try {
    // Skip binary files
    if (path.extname(file).match(/\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|svg|node)$/i)) {
      continue;
    }

    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch (error) {
      // Skip files that can't be read as text
      continue;
    }

    let modified = false;
    let newContent = content;
    const lines = content.split('\n');

    // Apply all replacements line by line
    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      let modifiedLine = originalLine;
      
      for (const { from, to } of replacements) {
        if (modifiedLine.includes(from)) {
          modifiedLine = modifiedLine.replaceAll(from, to);
        }
      }
      
      if (originalLine !== modifiedLine) {
        console.log(`${file}:${i+1}: ${originalLine} -> ${modifiedLine}`);
        lines[i] = modifiedLine;
        modified = true;
      }
    }

    // Save the file if modified
    if (modified) {
      newContent = lines.join('\n');
      writeFileSync(file, newContent, 'utf8');
      modifiedFiles++;
      console.log(`Modified: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`\nRenamed Vencord to Buhhcord in ${modifiedFiles} files`);
console.log('Note: This script only replaced text occurrences, not file names');
