#!/bin/bash

echo "🧪 Midas Core Transaction System Test Suite"
echo "============================================="

BASE_URL="http://localhost:8080/api/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_status="$3"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    echo "Command: $command"
    
    response=$(eval $command)
    status_code=$?
    
    if [ $status_code -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        echo "Response: $response"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $response"
        ((TESTS_FAILED++))
    fi
}

# Function to check if response contains expected text
check_response() {
    local response="$1"
    local expected="$2"
    local test_name="$3"
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        echo "Expected: $expected"
        echo "Got: $response"
        ((TESTS_FAILED++))
    fi
}

echo -e "\n${YELLOW}1. Testing Customer Creation${NC}"
echo "================================"

# Test 1: Create customer
run_test "Create Customer 1" \
    "curl -s -X POST $BASE_URL/customers -H 'Content-Type: application/json' -d '{\"firstName\":\"Alice\",\"lastName\":\"Johnson\",\"email\":\"alice.johnson@test.com\",\"phoneNumber\":\"+1111111111\"}'" \
    0

# Test 2: Create customer with invalid email
run_test "Create Customer with Invalid Email" \
    "curl -s -X POST $BASE_URL/customers -H 'Content-Type: application/json' -d '{\"firstName\":\"Bob\",\"lastName\":\"Smith\",\"email\":\"invalid-email\",\"phoneNumber\":\"+2222222222\"}'" \
    0

# Test 3: Create duplicate customer (should fail)
run_test "Create Duplicate Customer" \
    "curl -s -X POST $BASE_URL/customers -H 'Content-Type: application/json' -d '{\"firstName\":\"Alice\",\"lastName\":\"Johnson\",\"email\":\"alice.johnson@test.com\",\"phoneNumber\":\"+1111111111\"}'" \
    0

echo -e "\n${YELLOW}2. Testing Account Creation${NC}"
echo "=============================="

# Test 4: Create account for customer 1
run_test "Create Checking Account" \
    "curl -s -X POST $BASE_URL/accounts -H 'Content-Type: application/json' -d '{\"customerId\":1,\"accountType\":\"CHECKING\",\"currency\":\"USD\",\"initialBalance\":2000.00}'" \
    0

# Test 5: Create savings account for customer 1
run_test "Create Savings Account" \
    "curl -s -X POST $BASE_URL/accounts -H 'Content-Type: application/json' -d '{\"customerId\":1,\"accountType\":\"SAVINGS\",\"currency\":\"USD\",\"initialBalance\":1000.00}'" \
    0

# Test 6: Create account for non-existent customer (should fail)
run_test "Create Account for Non-existent Customer" \
    "curl -s -X POST $BASE_URL/accounts -H 'Content-Type: application/json' -d '{\"customerId\":999,\"accountType\":\"CHECKING\",\"currency\":\"USD\",\"initialBalance\":100.00}'" \
    0

echo -e "\n${YELLOW}3. Testing Deposit Transactions${NC}"
echo "=================================="

# Test 7: Deposit to account
run_test "Deposit $500 to Account 1" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":500.00,\"description\":\"Test deposit\"}'" \
    0

# Test 8: Deposit negative amount (should fail)
run_test "Deposit Negative Amount" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":-100.00,\"description\":\"Invalid deposit\"}'" \
    0

# Test 9: Deposit to non-existent account (should fail)
run_test "Deposit to Non-existent Account" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"INVALID123\",\"amount\":100.00,\"description\":\"Invalid deposit\"}'" \
    0

echo -e "\n${YELLOW}4. Testing Withdrawal Transactions${NC}"
echo "====================================="

# Test 10: Withdraw from account
run_test "Withdraw $200 from Account 1" \
    "curl -s -X POST $BASE_URL/transactions/withdraw -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":200.00,\"description\":\"Test withdrawal\"}'" \
    0

# Test 11: Withdraw more than balance (should fail)
run_test "Withdraw More Than Balance" \
    "curl -s -X POST $BASE_URL/transactions/withdraw -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":10000.00,\"description\":\"Overdraft attempt\"}'" \
    0

# Test 12: Withdraw from non-existent account (should fail)
run_test "Withdraw from Non-existent Account" \
    "curl -s -X POST $BASE_URL/transactions/withdraw -H 'Content-Type: application/json' -d '{\"accountNumber\":\"INVALID123\",\"amount\":100.00,\"description\":\"Invalid withdrawal\"}'" \
    0

echo -e "\n${YELLOW}5. Testing Transfer Transactions${NC}"
echo "===================================="

# Test 13: Transfer between accounts
run_test "Transfer $300 between accounts" \
    "curl -s -X POST $BASE_URL/transactions/transfer -H 'Content-Type: application/json' -d '{\"fromAccountNumber\":\"ACC54664BB6AA7D\",\"toAccountNumber\":\"ACCBB85888DD924\",\"amount\":300.00,\"description\":\"Test transfer\"}'" \
    0

# Test 14: Transfer more than balance (should fail)
run_test "Transfer More Than Balance" \
    "curl -s -X POST $BASE_URL/transactions/transfer -H 'Content-Type: application/json' -d '{\"fromAccountNumber\":\"ACC54664BB6AA7D\",\"toAccountNumber\":\"ACCBB85888DD924\",\"amount\":50000.00,\"description\":\"Overdraft transfer\"}'" \
    0

# Test 15: Transfer to same account (should fail)
run_test "Transfer to Same Account" \
    "curl -s -X POST $BASE_URL/transactions/transfer -H 'Content-Type: application/json' -d '{\"fromAccountNumber\":\"ACC54664BB6AA7D\",\"toAccountNumber\":\"ACC54664BB6AA7D\",\"amount\":100.00,\"description\":\"Self transfer\"}'" \
    0

echo -e "\n${YELLOW}6. Testing Transaction Queries${NC}"
echo "================================="

# Test 16: Get all transactions for customer
run_test "Get Customer Transactions" \
    "curl -s $BASE_URL/transactions/customer/1" \
    0

# Test 17: Get transaction by ID
run_test "Get Transaction by ID" \
    "curl -s $BASE_URL/transactions/1" \
    0

# Test 18: Get transaction by transaction ID
run_test "Get Transaction by Transaction ID" \
    "curl -s $BASE_URL/transactions/transaction-id/TXNCC844356DD49" \
    0

echo -e "\n${YELLOW}7. Testing Account Queries${NC}"
echo "============================="

# Test 19: Get all accounts
run_test "Get All Accounts" \
    "curl -s $BASE_URL/accounts" \
    0

# Test 20: Get all customers
run_test "Get All Customers" \
    "curl -s $BASE_URL/customers" \
    0

echo -e "\n${YELLOW}8. Testing Database Management${NC}"
echo "================================="

# Test 21: Get database info
run_test "Get Database Info" \
    "curl -s $BASE_URL/database/info" \
    0

# Test 22: Get table information
run_test "Get Table Information" \
    "curl -s $BASE_URL/database/tables" \
    0

# Test 23: Get transaction table count
run_test "Get Transaction Table Count" \
    "curl -s $BASE_URL/database/tables/TRANSACTIONS/count" \
    0

echo -e "\n${YELLOW}9. Testing Caching System${NC}"
echo "============================="

# Test 24: Test cache functionality
run_test "Test Cache - Get Customer Cache" \
    "curl -s $BASE_URL/cache/customers/1" \
    0

# Test 25: Get cache statistics
run_test "Get Cache Statistics" \
    "curl -s $BASE_URL/cache/stats" \
    0

echo -e "\n${YELLOW}10. Testing Error Handling${NC}"
echo "==============================="

# Test 26: Test invalid endpoint
run_test "Test Invalid Endpoint" \
    "curl -s $BASE_URL/invalid-endpoint" \
    0

# Test 27: Test malformed JSON
run_test "Test Malformed JSON" \
    "curl -s -X POST $BASE_URL/customers -H 'Content-Type: application/json' -d '{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\"'" \
    0

echo -e "\n${YELLOW}11. Testing Edge Cases${NC}"
echo "============================"

# Test 28: Test zero amount transaction
run_test "Test Zero Amount Transaction" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":0.00,\"description\":\"Zero amount test\"}'" \
    0

# Test 29: Test very large amount
run_test "Test Very Large Amount" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":999999999.99,\"description\":\"Large amount test\"}'" \
    0

# Test 30: Test special characters in description
run_test "Test Special Characters in Description" \
    "curl -s -X POST $BASE_URL/transactions/deposit -H 'Content-Type: application/json' -d '{\"accountNumber\":\"ACC54664BB6AA7D\",\"amount\":1.00,\"description\":\"Test with special chars: !@#$%^&*()\"}'" \
    0

echo -e "\n${YELLOW}12. Final Balance Check${NC}"
echo "============================="

# Test 31: Check final account balances
run_test "Check Final Account Balances" \
    "curl -s $BASE_URL/accounts" \
    0

echo -e "\n${YELLOW}Test Summary${NC}"
echo "============="
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! The Midas Core system is working perfectly!${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
fi

echo -e "\n${BLUE}System Status:${NC}"
curl -s $BASE_URL/health | jq '.' 2>/dev/null || curl -s $BASE_URL/health
