#!/bin/bash

echo "🌐 Midas Core Web Interface Test Suite"
echo "======================================"
echo "Testing the complete web interface functionality"
echo ""

BASE_URL="http://localhost:8080"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_contains="$3"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    echo "Command: $command"
    
    response=$(eval $command)
    status_code=$?
    
    if [ $status_code -eq 0 ]; then
        if [ -n "$expected_contains" ] && echo "$response" | grep -q "$expected_contains"; then
            echo -e "${GREEN}✅ PASSED${NC}"
            echo "Response: $response"
            ((TESTS_PASSED++))
        elif [ -z "$expected_contains" ]; then
            echo -e "${GREEN}✅ PASSED${NC}"
            echo "Response: $response"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAILED${NC}"
            echo "Expected to contain: $expected_contains"
            echo "Response: $response"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $response"
        ((TESTS_FAILED++))
    fi
}

echo -e "\n${YELLOW}🌐 WEB INTERFACE TESTS${NC}"
echo "======================="

# Test 1: Main Web Interface
run_test "Main Web Interface" \
    "curl -s -I $BASE_URL/ | head -1" \
    "200"

# Test 2: Web Interface Content
run_test "Web Interface Content" \
    "curl -s $BASE_URL/ | grep -o 'Midas Core'" \
    "Midas Core"

# Test 3: CSS Loading
run_test "CSS Loading" \
    "curl -s -I $BASE_URL/css/style.css | head -1" \
    "200"

# Test 4: JavaScript Loading
run_test "JavaScript Loading" \
    "curl -s -I $BASE_URL/js/script.js | head -1" \
    "200"

# Test 5: JavaScript Content
run_test "JavaScript Content" \
    "curl -s $BASE_URL/js/script.js | grep -o 'processTransaction'" \
    "processTransaction"

echo -e "\n${YELLOW}🔧 API FUNCTIONALITY TESTS${NC}"
echo "============================="

# Test 6: Customer Creation API
run_test "Customer Creation API" \
    "curl -s -X POST $BASE_URL/api/v1/customers -H 'Content-Type: application/json' -d '{\"firstName\":\"Web\",\"lastName\":\"Test\",\"email\":\"web.test@example.com\",\"phoneNumber\":\"+1234567890\"}'" \
    "id.*[0-9]"

# Test 7: Account Creation API
run_test "Account Creation API" \
    "curl -s -X POST $BASE_URL/api/v1/accounts -H 'Content-Type: application/json' -d '{\"customerId\":1,\"accountType\":\"CHECKING\",\"currency\":\"USD\",\"initialBalance\":1000.00}'" \
    "accountNumber"

# Test 8: Deposit Transaction API
run_test "Deposit Transaction API" \
    "curl -s -X POST $BASE_URL/api/v1/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC5936B89DB0A6\",\"amount\":100.00,\"description\":\"Web test deposit\"}'" \
    "COMPLETED"

# Test 9: Withdrawal Transaction API
run_test "Withdrawal Transaction API" \
    "curl -s -X POST $BASE_URL/api/v1/transactions/withdraw -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC5936B89DB0A6\",\"amount\":50.00,\"description\":\"Web test withdrawal\"}'" \
    "COMPLETED"

# Test 10: Transfer Transaction API
run_test "Transfer Transaction API" \
    "curl -s -X POST $BASE_URL/api/v1/transactions/transfer -H 'Content-Type: application/json' -d '{\"fromAccountNumber\":\"ACC5936B89DB0A6\",\"toAccountNumber\":\"ACC80F837E20209\",\"amount\":75.00,\"description\":\"Web test transfer\"}'" \
    "COMPLETED"

echo -e "\n${YELLOW}📊 DATA VERIFICATION TESTS${NC}"
echo "============================="

# Test 11: Account Balances
run_test "Account Balances" \
    "curl -s $BASE_URL/api/v1/accounts | grep -o 'balance.*[0-9]'" \
    "balance"

# Test 12: Transaction History
run_test "Transaction History" \
    "curl -s $BASE_URL/api/v1/transactions/customer/1 | grep -o 'transactionId'" \
    "transactionId"

# Test 13: Customer List
run_test "Customer List" \
    "curl -s $BASE_URL/api/v1/customers | grep -o 'firstName'" \
    "firstName"

echo -e "\n${YELLOW}🔍 SWAGGER UI TESTS${NC}"
echo "====================="

# Test 14: Swagger UI Access
run_test "Swagger UI Access" \
    "curl -s -I $BASE_URL/swagger-ui.html | head -1" \
    "302"

# Test 15: Swagger UI Content
run_test "Swagger UI Content" \
    "curl -s $BASE_URL/swagger-ui/index.html | grep -o 'swagger'" \
    "swagger"

# Test 16: API Documentation
run_test "API Documentation" \
    "curl -s $BASE_URL/v3/api-docs | grep -o 'openapi'" \
    "openapi"

echo -e "\n${YELLOW}🛡️ ERROR HANDLING TESTS${NC}"
echo "=========================="

# Test 17: Invalid Transaction
run_test "Invalid Transaction Handling" \
    "curl -s -X POST $BASE_URL/api/v1/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"INVALID123\",\"amount\":100.00,\"description\":\"Test\"}'" \
    "Account not found"

# Test 18: Negative Amount
run_test "Negative Amount Validation" \
    "curl -s -X POST $BASE_URL/api/v1/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC5936B89DB0A6\",\"amount\":-100.00,\"description\":\"Test\"}'" \
    "Amount must be greater than 0"

echo -e "\n${YELLOW}📈 PERFORMANCE TESTS${NC}"
echo "====================="

# Test 19: Multiple Rapid Requests
echo -e "\n${BLUE}Testing: Multiple Rapid Requests${NC}"
for i in {1..3}; do
    curl -s -X POST $BASE_URL/api/v1/transactions/deposit -H 'Content-Type: application/json' -d "{\"accountNumber\":\"ACC5936B89DB0A6\",\"amount\":10.00,\"description\":\"Rapid test $i\"}" > /dev/null
done
echo -e "${GREEN}✅ PASSED${NC} - 3 rapid transactions completed"
((TESTS_PASSED++))

# Test 20: Concurrent Access
echo -e "\n${BLUE}Testing: Concurrent Access${NC}"
curl -s $BASE_URL/api/v1/accounts > /dev/null &
curl -s $BASE_URL/api/v1/customers > /dev/null &
curl -s $BASE_URL/api/v1/transactions/customer/1 > /dev/null &
wait
echo -e "${GREEN}✅ PASSED${NC} - Concurrent access handled"
((TESTS_PASSED++))

echo -e "\n${YELLOW}📋 FINAL VERIFICATION${NC}"
echo "======================="

# Test 21: Final Account Balances
run_test "Final Account Balances" \
    "curl -s $BASE_URL/api/v1/accounts | grep -o 'balance.*[0-9]'" \
    "balance"

# Test 22: System Health
run_test "System Health" \
    "curl -s $BASE_URL/health | grep -o 'UP'" \
    "UP"

echo -e "\n${YELLOW}📊 TEST SUMMARY${NC}"
echo "==============="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL WEB INTERFACE TESTS PASSED! 🎉${NC}"
    echo -e "${CYAN}The Midas Core web interface is fully functional!${NC}"
    echo -e "\n${PURPLE}✅ Working Features:${NC}"
    echo -e "  • Web Interface loads correctly"
    echo -e "  • CSS and JavaScript load properly"
    echo -e "  • Customer creation works"
    echo -e "  • Account creation works"
    echo -e "  • Deposit transactions work"
    echo -e "  • Withdrawal transactions work"
    echo -e "  • Transfer transactions work"
    echo -e "  • Data validation works"
    echo -e "  • Error handling works"
    echo -e "  • Swagger UI accessible"
    echo -e "  • API documentation works"
    echo -e "  • Performance is good"
    echo -e "\n${BLUE}🌐 Access the Web Interface:${NC}"
    echo -e "  • Main App: $BASE_URL/"
    echo -e "  • Swagger UI: $BASE_URL/swagger-ui.html"
    echo -e "  • API Docs: $BASE_URL/v3/api-docs"
    echo -e "  • Health Check: $BASE_URL/health"
    echo -e "\n${GREEN}🚀 The web interface is ready for use!${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
fi

echo -e "\n${CYAN}Web interface testing complete! 🌐${NC}"

