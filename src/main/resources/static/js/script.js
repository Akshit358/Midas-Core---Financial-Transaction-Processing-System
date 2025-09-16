// Global variables
let customers = [];
let accounts = [];
let transactions = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSystemStats();
    loadCustomers();
    loadAccounts();
    loadTransactions();
    loadSystemHealth();
    
    // Set up smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update stats every 30 seconds
    setInterval(loadSystemStats, 30000);
    setInterval(loadSystemHealth, 30000);
});

// Navigation functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Demo tab functions
function showDemoTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.demo-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.demo-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    document.getElementById(tabName + '-demo').classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// API functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API call failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Error: ' + error.message, 'error');
        throw error;
    }
}

// Load system statistics
async function loadSystemStats() {
    try {
        const [customersData, accountsData, transactionsData] = await Promise.all([
            apiCall('/api/v1/customers'),
            apiCall('/api/v1/accounts'),
            apiCall('/api/v1/transactions/customer/1') // Get some transactions
        ]);
        
        document.getElementById('customers-count').textContent = customersData.length || 0;
        document.getElementById('accounts-count').textContent = accountsData.length || 0;
        document.getElementById('transactions-count').textContent = transactionsData.length || 0;
        
        // Update the data arrays
        customers = customersData || [];
        accounts = accountsData || [];
        transactions = transactionsData || [];
        
        // Update customer select dropdown
        updateCustomerSelect();
        
    } catch (error) {
        console.error('Failed to load system stats:', error);
    }
}

// Load customers
async function loadCustomers() {
    try {
        const data = await apiCall('/api/v1/customers');
        customers = data || [];
        displayCustomers(customers);
    } catch (error) {
        console.error('Failed to load customers:', error);
    }
}

// Load accounts
async function loadAccounts() {
    try {
        const data = await apiCall('/api/v1/accounts');
        accounts = data || [];
        displayAccounts(accounts);
    } catch (error) {
        console.error('Failed to load accounts:', error);
    }
}

// Load transactions
async function loadTransactions() {
    try {
        // Get transactions for the first customer if available
        if (customers.length > 0) {
            const data = await apiCall(`/api/v1/transactions/customer/${customers[0].id}`);
            transactions = data || [];
        }
        displayTransactions(transactions);
    } catch (error) {
        console.error('Failed to load transactions:', error);
    }
}

// Load system health
async function loadSystemHealth() {
    try {
        const healthData = await apiCall('/actuator/health');
        
        // Update system status
        const systemStatus = healthData.status === 'UP' ? 'UP' : 'DOWN';
        document.getElementById('system-status').textContent = systemStatus;
        document.getElementById('system-health').textContent = systemStatus;
        
        // Update health details
        const healthDetails = document.getElementById('health-details');
        if (healthDetails) {
            healthDetails.innerHTML = `
                <div class="status-item">
                    <strong>Overall Status:</strong> ${healthData.status}
                </div>
                <div class="status-item">
                    <strong>Database:</strong> ${healthData.components?.db?.status || 'Unknown'}
                </div>
                <div class="status-item">
                    <strong>Disk Space:</strong> ${healthData.components?.diskSpace?.status || 'Unknown'}
                </div>
            `;
        }
        
        // Update database status
        const dbStatus = healthData.components?.db?.status === 'UP' ? 'UP' : 'DOWN';
        document.getElementById('db-status').textContent = dbStatus;
        
        if (document.getElementById('db-details')) {
            document.getElementById('db-details').innerHTML = `
                <div class="status-item">
                    <strong>Type:</strong> ${healthData.components?.db?.details?.database || 'Unknown'}
                </div>
                <div class="status-item">
                    <strong>Status:</strong> ${dbStatus}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Failed to load system health:', error);
        document.getElementById('system-status').textContent = 'ERROR';
        document.getElementById('system-health').textContent = 'ERROR';
    }
}

// Customer management functions
async function createCustomer() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const customerData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone || null,
            country: 'USA'
        };
        
        const newCustomer = await apiCall('/api/v1/customers', 'POST', customerData);
        customers.unshift(newCustomer);
        displayCustomers(customers);
        
        // Clear form
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        
        showNotification('Customer created successfully!', 'success');
        loadSystemStats(); // Refresh stats
        
    } catch (error) {
        console.error('Failed to create customer:', error);
    }
}

// Account management functions
async function createAccount() {
    const customerId = document.getElementById('customerSelect').value;
    const accountType = document.getElementById('accountType').value;
    const currency = document.getElementById('currency').value;
    
    if (!customerId) {
        showNotification('Please select a customer', 'error');
        return;
    }
    
    try {
        const accountData = {
            customerId: parseInt(customerId),
            accountType: accountType,
            currency: currency,
            initialBalance: 0
        };
        
        const newAccount = await apiCall('/api/v1/accounts', 'POST', accountData);
        accounts.unshift(newAccount);
        displayAccounts(accounts);
        
        // Clear form
        document.getElementById('customerSelect').value = '';
        document.getElementById('accountType').value = 'CHECKING';
        document.getElementById('currency').value = 'USD';
        
        showNotification('Account created successfully!', 'success');
        loadSystemStats(); // Refresh stats
        
    } catch (error) {
        console.error('Failed to create account:', error);
    }
}

// Transaction management functions
async function processTransaction() {
    const transactionType = document.getElementById('transactionType').value;
    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    try {
        let endpoint = '';
        let transactionData = {
            amount: amount,
            currency: 'USD',
            description: description || `${transactionType.toLowerCase()} transaction`
        };
        
        switch (transactionType) {
            case 'DEPOSIT':
                if (!toAccount) {
                    showNotification('Please enter a destination account for deposit', 'error');
                    return;
                }
                endpoint = '/api/v1/transactions/deposit';
                transactionData.toAccountNumber = toAccount;
                break;
            case 'WITHDRAWAL':
                if (!fromAccount) {
                    showNotification('Please enter a source account for withdrawal', 'error');
                    return;
                }
                endpoint = '/api/v1/transactions/withdraw';
                transactionData.fromAccountNumber = fromAccount;
                break;
            case 'TRANSFER':
                if (!fromAccount || !toAccount) {
                    showNotification('Please enter both source and destination accounts for transfer', 'error');
                    return;
                }
                endpoint = '/api/v1/transactions/transfer';
                transactionData.fromAccountNumber = fromAccount;
                transactionData.toAccountNumber = toAccount;
                break;
        }
        
        const newTransaction = await apiCall(endpoint, 'POST', transactionData);
        transactions.unshift(newTransaction);
        displayTransactions(transactions);
        
        // Clear form
        document.getElementById('fromAccount').value = '';
        document.getElementById('toAccount').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        
        showNotification('Transaction processed successfully!', 'success');
        loadSystemStats(); // Refresh stats
        
    } catch (error) {
        console.error('Failed to process transaction:', error);
    }
}

// Display functions
function displayCustomers(customersList) {
    const container = document.getElementById('customers-list');
    if (!container) return;
    
    container.innerHTML = customersList.slice(0, 5).map(customer => `
        <div class="result-item">
            <strong>${customer.firstName} ${customer.lastName}</strong><br>
            <small>Email: ${customer.email}</small><br>
            <small>Phone: ${customer.phone || 'N/A'}</small><br>
            <small>Status: ${customer.isActive ? 'Active' : 'Inactive'}</small>
        </div>
    `).join('');
}

function displayAccounts(accountsList) {
    const container = document.getElementById('accounts-list');
    if (!container) return;
    
    container.innerHTML = accountsList.slice(0, 5).map(account => `
        <div class="result-item">
            <strong>Account: ${account.accountNumber}</strong><br>
            <small>Type: ${account.accountType}</small><br>
            <small>Balance: ${account.currency} ${account.balance}</small><br>
            <small>Status: ${account.isActive ? 'Active' : 'Inactive'}</small>
        </div>
    `).join('');
}

function displayTransactions(transactionsList) {
    const container = document.getElementById('transactions-list');
    if (!container) return;
    
    container.innerHTML = transactionsList.slice(0, 5).map(transaction => `
        <div class="result-item">
            <strong>${transaction.transactionId}</strong><br>
            <small>Type: ${transaction.transactionType}</small><br>
            <small>Amount: ${transaction.currency} ${transaction.amount}</small><br>
            <small>Status: ${transaction.status}</small>
        </div>
    `).join('');
}

function updateCustomerSelect() {
    const select = document.getElementById('customerSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Customer</option>' +
        customers.map(customer => 
            `<option value="${customer.id}">${customer.firstName} ${customer.lastName} (${customer.email})</option>`
        ).join('');
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// API utility functions
function openSwaggerUI() {
    window.open('/swagger-ui.html', '_blank');
}

function downloadAPI() {
    window.open('/v3/api-docs', '_blank');
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status-item {
        margin-bottom: 0.5rem;
        padding: 0.25rem 0;
    }
`;
document.head.appendChild(style);
