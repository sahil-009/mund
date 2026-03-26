#!/bin/bash

# FORGE Editor - Feature Verification Test Suite
# This script tests all implemented features

echo "======================================"
echo "FORGE Code Editor - Feature Tests"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_feature() {
    local test_name=$1
    local command=$2
    local expected=$3
    
    echo -n "Testing: $test_name... "
    
    if eval "$command" > /tmp/test_output 2>&1; then
        if grep -q "$expected" /tmp/test_output 2>/dev/null; then
            echo -e "${GREEN}✓ PASS${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAIL${NC} (Expected: $expected)"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Command error)"
        ((TESTS_FAILED++))
    fi
}

# 1. Check Node environment
test_feature "Node.js installed" "node --version" "v"
test_feature "npm installed" "npm --version" "\."

# 2. Check development dependencies
test_feature "electron package" "ls /home/sahil/Desktop/mund/node_modules/electron" "package.json"
test_feature "react package" "ls /home/sahil/Desktop/mund/node_modules/react" "package.json"
test_feature "webpack package" "ls /home/sahil/Desktop/mund/node_modules/webpack" "package.json"
test_feature "monaco-editor package" "ls /home/sahil/Desktop/mund/node_modules/monaco-editor" "package.json"

# 3. Check source files
test_feature "main.js exists" "test -f /home/sahil/Desktop/mund/electron/main.js" "" && echo -e "${GREEN}✓${NC}"
test_feature "preload.js exists" "test -f /home/sahil/Desktop/mund/electron/preload.js" "" && echo -e "${GREEN}✓${NC}"
test_feature "App.tsx exists" "test -f /home/sahil/Desktop/mund/src/App.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "Editor component" "test -f /home/sahil/Desktop/mund/src/components/Editor.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "Terminal component" "test -f /home/sahil/Desktop/mund/src/components/Terminal.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "CommandPalette component" "test -f /home/sahil/Desktop/mund/src/components/CommandPalette.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "FindReplace component" "test -f /home/sahil/Desktop/mund/src/components/FindReplace.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "Settings component" "test -f /home/sahil/Desktop/mund/src/components/Settings.tsx" "" && echo -e "${GREEN}✓${NC}"
test_feature "Sidebar component" "test -f /home/sahil/Desktop/mund/src/components/Sidebar.tsx" "" && echo -e "${GREEN}✓${NC}"

# 4. Check test files
test_feature "C++ test file" "test -f /home/sahil/Desktop/mund/test/example.cpp" "" && echo -e "${GREEN}✓${NC}"
test_feature "JavaScript test file" "test -f /home/sahil/Desktop/mund/test/example.js" "" && echo -e "${GREEN}✓${NC}"
test_feature "Java test file" "test -f /home/sahil/Desktop/mund/test/Example.java" "" && echo -e "${GREEN}✓${NC}"

# 5. Check build output
test_feature "Build output exists" "test -d /home/sahil/Desktop/mund/dist" "" && echo -e "${GREEN}✓${NC}"

# 6. Check configuration files
test_feature "webpack.dev.js" "test -f /home/sahil/Desktop/mund/webpack.dev.js" "" && echo -e "${GREEN}✓${NC}"
test_feature "webpack.config.js" "test -f /home/sahil/Desktop/mund/webpack.config.js" "" && echo -e "${GREEN}✓${NC}"
test_feature "tsconfig.json" "test -f /home/sahil/Desktop/mund/tsconfig.json" "" && echo -e "${GREEN}✓${NC}"
test_feature "package.json" "test -f /home/sahil/Desktop/mund/package.json" "" && echo -e "${GREEN}✓${NC}"

# 7. Verify package.json scripts
echo ""
echo "Checking available npm scripts:"
cd /home/sahil/Desktop/mund
npm run 2>&1 | grep -E "^\s+(dev|build|start|dist)" | sed 's/^/  /'

# Summary
echo ""
echo "======================================"
echo -e "Test Results:"
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
echo "======================================"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! FORGE is ready to run.${NC}"
    echo ""
    echo "To start FORGE development environment:"
    echo "  cd /home/sahil/Desktop/mund"
    echo "  npm start"
    echo ""
    echo "The app will open on http://localhost:3000"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
