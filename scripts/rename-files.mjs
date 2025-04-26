#!/usr/bin/env node

/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Buhhcord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { renameSync, readdirSync, statSync, existsSync } from 'fs';
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
  !file.includes('scripts/rename-files.mjs') && 
  !file.includes('scripts/rename-to-buhhcord.mjs')
);

console.log(`Found ${files.length} files to scan for renaming`);

// Mapping for different case variations in filenames
const replacements = [
  { from: 'Vencord', to: 'Buhhcord' },
  { from: 'vencord', to: 'buhhcord' },
  { from: 'VENCORD', to: 'BUHHCORD' }
];

// Process each file
let renamedFiles = 0;
for (const filePath of files) {
  try {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    let newFileName = fileName;
    
    // Apply all replacements to the filename
    for (const { from, to } of replacements) {
      if (newFileName.includes(from)) {
        newFileName = newFileName.replaceAll(from, to);
      }
    }
    
    // If the filename changed, rename the file
    if (newFileName !== fileName) {
      const newPath = path.join(dir, newFileName);
      
      // Check if the destination already exists
      if (existsSync(newPath)) {
        console.log(`Cannot rename: destination already exists: ${newPath}`);
        continue;
      }
      
      renameSync(filePath, newPath);
      console.log(`Renamed: ${filePath} -> ${newPath}`);
      renamedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nRenamed ${renamedFiles} files`);
console.log('Note: You may need to update import statements in your code if they reference the renamed files');
