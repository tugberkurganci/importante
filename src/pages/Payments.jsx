import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, ListGroup } from 'react-bootstrap';
import http from '../lib/http';
import http2 from '../lib/http2';
import { useSelector } from 'react-redux';

const Payments = () => {
  const [requests, setRequests] = useState([]);
  const [refresh, setRefresh] = useState(false); // State to trigger useEffect
    const auth = useSelector(state => state.auth);
  useEffect(() => {
    // Fetch all requests from the backend
    if(auth.role === 'EMPLOYEE') {  http.get(`/api/requests/user-payments/${auth.id}`)
        .then(response => {
          setRequests(response.data);
        })
        .catch(error => {
          console.error("Error fetching requests", error);
        });}else{http.get('/api/requests/user-payments')
            .then(response => {
              setRequests(response.data);
            })
            .catch(error => {
              console.error("Error fetching requests", error);
            });}
    
  }, [refresh]); // Dependency array includes 'refresh'

  const handleProcessPayments = (request) => {
    
    http2.get(`/api/transaction-status/${request.paymentTransaction1}`)
      .then(response => {
        if (response.data === 'COMPLETE') {
          // Update paymentTransaction1Status
          return http.put(`/api/requests/transaction`, {
            transactionId: request.paymentTransaction1,
          requestId: request.id 
          });
        } else {
          throw new Error("Payment transaction 1 not completed");
        }
      })
      .then(() => {
        // Perform the transfer
        return http2.post(`/api/transfer`, {
            senderWalletId: "cb4ecb43-5d90-545a-924d-9fa6a5601d52",
            receiverAddress: request.employeeAdress, // corrected field name
            amount: request.amount/2
        });
      })
      .then(transferResponse => {
        const transferId = transferResponse.data.id; // Capture the transfer ID

        // Update paymentTransaction2Status and include the transfer ID
        return http.put(`/api/requests/transaction2`, {
          transactionId: transferId,
          requestId: request.id // Add the transfer ID here
        });
      })
      .then(response => {
        console.log("Request updated successfully", response);
        alert("Payments processed successfully");
      })
      .catch(error => {
        console.error("Error processing payments", error);
        alert("Error processing payments. Please try again.");
      })
      .finally(() => {
        setRefresh(prev => !prev); // Toggle the refresh state to re-trigger useEffect
      });
  };

  return (
    <div>
      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map(request => (
          <Card key={request.id} style={{ marginBottom: '1rem' }}>
            <Card.Body>
              <Card.Title>Request ID: {request.id}</Card.Title>
              <ListGroup>
                <ListGroup.Item><strong>Payment Transaction Status:</strong> {request.paymentTransaction2Status ? 'Completed' : 'Waiting'}</ListGroup.Item>
                <ListGroup.Item><strong>Employee Address:</strong> {request.employeeAdress}</ListGroup.Item>
                <ListGroup.Item><strong>Amount:</strong> {request.amount}</ListGroup.Item>
                <ListGroup.Item><strong>Status:</strong> <Badge className="badge-primary">{request?.status}</Badge></ListGroup.Item>
              </ListGroup>
              {auth.role ===" MANAGER " && <Button variant="primary" onClick={() => handleProcessPayments(request)}>
                Process Payments
              </Button>}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default Payments;


