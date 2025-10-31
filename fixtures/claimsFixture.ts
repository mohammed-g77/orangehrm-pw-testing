import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ClaimFixture, Employee, Claim } from '../helpers/apiHelpers';

// Use process.cwd() for better compatibility
const FIXTURES_DIR = join(process.cwd(), 'fixtures');
const FIXTURES_FILE = join(FIXTURES_DIR, 'claimsData.json');

export function saveClaimFixture(fixture: ClaimFixture): void {
  let fixtures: ClaimFixture[] = [];
  
  // Read existing fixtures if file exists
  if (existsSync(FIXTURES_FILE)) {
    try {
      const fileContent = readFileSync(FIXTURES_FILE, 'utf-8');
      fixtures = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading fixtures file:', error);
      fixtures = [];
    }
  }
  
  // Add new fixture
  fixtures.push(fixture);
  
  // Write back to file
  writeFileSync(FIXTURES_FILE, JSON.stringify(fixtures, null, 2));
}

export function loadClaimFixtures(): ClaimFixture[] {
  if (!existsSync(FIXTURES_FILE)) {
    return [];
  }
  
  try {
    const fileContent = readFileSync(FIXTURES_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading fixtures file:', error);
    return [];
  }
}

export function getLatestClaimFixture(): ClaimFixture | null {
  const fixtures = loadClaimFixtures();
  return fixtures.length > 0 ? fixtures[fixtures.length - 1] : null;
}

export function clearClaimFixtures(): void {
  if (existsSync(FIXTURES_FILE)) {
    writeFileSync(FIXTURES_FILE, JSON.stringify([], null, 2));
  }
}

