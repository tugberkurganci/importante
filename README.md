# Apartment Residents Fullstack Project

This project is a fullstack application designed for apartment residents. It offers various features to enhance community living and streamline services. Below are the key functionalities and details of the project.

## Features

### Concierge Services
Residents can choose from a variety of concierge services, such as cleaning, maintenance, and more. An algorithm efficiently matches users with available workers based on their requests.

### Events and Surveys
Users can create and participate in events and surveys within the community, fostering engagement and interaction among residents.

### Car Management
Residents have the ability to register and delete their cars in the system, providing a convenient way to manage parking and vehicle information.

### Nearby Amenities
Users can view nearby pharmacies and taxi stands, making it easy to find essential services in the vicinity.

### Financial Section
The financial section is a critical part of the system. Here's how it works:
1. **Service Request and Payment**: When a user requests a service and makes a payment, the payment is first directed to the manager's wallet.
2. **Commission Deduction**: A commission is deducted from the payment.
3. **Worker Payment**: After deducting the commission, the remaining amount is transferred to the worker's wallet.

This entire payment infrastructure is built using Circle's platform. Using a developer controller structure, each user is assigned a new wallet within a single wallet set. Once the service is completed and the manager verifies the transaction, the payment is made to the worker.

## Screenshots

### Main Page
![main](https://github.com/user-attachments/assets/b363e55d-3ec9-4a1f-91bb-c41470388b6c)

### User Profile
![profile](https://github.com/user-attachments/assets/7a2c6b5d-277a-4123-9046-3685ee54db67)

### Service Request
![request](https://github.com/user-attachments/assets/fac6487c-479a-47a4-8b8a-316f2c2560c7)

### Request Creation
![requestcreation](https://github.com/user-attachments/assets/7de6d5f9-2fc5-4ae4-a6d5-d922980fbb59)

### Manager Payments
![managerpayments](https://github.com/user-attachments/assets/02bc8f50-7b29-4475-964c-3e07559dbbd3)

### Employee Payments
![employeePayments](https://github.com/user-attachments/assets/63822851-279d-4adc-9a1f-914df47d6d3f)

## Technology Stack

- **Frontend**: React, TypeScript, JavaScript, React Bootstrap
- **Backend**: Spring Boot, Java, Go
- **Database**: MySQL, Hibernate
- **Payments**: Circle's platform

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/your-repo.git

   https://www.youtube.com/watch?v=QeF9B24nQ3A this video about this project
