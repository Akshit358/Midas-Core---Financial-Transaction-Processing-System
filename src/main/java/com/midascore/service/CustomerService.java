package com.midascore.service;

import com.midascore.model.Customer;
import com.midascore.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Customer createCustomer(Customer customer) {
        // Check if email already exists
        if (customerRepository.findByEmailAndIsDeletedFalse(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customer.getEmail() + " already exists");
        }
        
        return customerRepository.save(customer);
    }
    
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .filter(customer -> !customer.getIsDeleted());
    }
    
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmailAndIsDeletedFalse(email);
    }
    
    public List<Customer> getAllActiveCustomers() {
        return customerRepository.findByIsActiveTrueAndIsDeletedFalse();
    }
    
    public List<Customer> getAllVerifiedCustomers() {
        return customerRepository.findByIsVerifiedTrueAndIsDeletedFalse();
    }
    
    public List<Customer> searchCustomersByName(String name) {
        return customerRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(name);
    }
    
    public Customer updateCustomer(Customer customer) {
        Customer existingCustomer = customerRepository.findById(customer.getId())
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Update fields
        existingCustomer.setFirstName(customer.getFirstName());
        existingCustomer.setLastName(customer.getLastName());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setDateOfBirth(customer.getDateOfBirth());
        existingCustomer.setAddress(customer.getAddress());
        existingCustomer.setCity(customer.getCity());
        existingCustomer.setState(customer.getState());
        existingCustomer.setPostalCode(customer.getPostalCode());
        existingCustomer.setCountry(customer.getCountry());
        
        return customerRepository.save(existingCustomer);
    }
    
    public void verifyCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setIsVerified(true);
        customerRepository.save(customer);
    }
    
    public void deactivateCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setIsActive(false);
        customerRepository.save(customer);
    }
    
    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setIsDeleted(true);
        customerRepository.save(customer);
    }
    
    public Long getActiveCustomerCount() {
        return customerRepository.countActiveCustomers();
    }
    
    public Long getVerifiedCustomerCount() {
        return customerRepository.countVerifiedCustomers();
    }
}
