import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import http2 from '../lib/http2';
import { useSelector } from 'react-redux';
import '../pages/styles.css';
import { useLocation } from 'react-router-dom';
import http from '../lib/http';

const RequestCreation = ({ setRefresh }) => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(location.state ? true : false);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [services, setServices] = useState([]);
  const [balance, setBalance] = useState(null);
  const auth = useSelector(state => state.auth);
  const [userInfo, setUserInfo] = useState(null); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info and services first

        
        const [userResponse, servicesResponse] = await Promise.all([


          http.get(`/api/user/${auth.id}`),
          http.get('/api/concierge-services')
        ]);
  
        // Set user info and services
        setUserInfo(userResponse.data);
        setServices(servicesResponse.data);
  
        // Fetch balance using the walletId from userInfo
        if (userResponse.data.walletId) {
          const balanceResponse = await http2.get(`/api/balance/${userResponse.data.walletId}`);
          const balanceString = balanceResponse.data.balance;
        const balance = parseFloat(balanceString);

        if (!isNaN(balance)) {
          setBalance(balance);
          console.log('Balance:', balance);
        } else {
          console.error('Balance data is not a valid number');
        }
      } else {
        console.error('User walletId not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
        }
  
    
    
  
    fetchData();
  }, [auth.id]); // Add auth.id as a dependency to re-fetch when auth.id changes
  


  const initialValues = {
    serviceId: '',
    startTime: '',
    endTime: '',
  };

  const validationSchema = Yup.object().shape({
    serviceId: Yup.string().required('Service is required'),
    startTime: Yup.string().required('Start Time is required'),
    endTime: Yup.string().required('End Time is required'),
  });

  const onSubmit = async (values, { resetForm }) => {
    if (balance < selectedService.price) {
      alert('Insufficient balance for this service!');
      return;
    }
  
    try {
      // İlk olarak request oluşturuluyor
      const response = await http.post('/api/requests', { ...values, userId: auth.id });
      const createdRequest = response.data; // 'response.data' ile 'createdRequest' alınır
        console.log(response.data)
      // Transfer işlemi için gerekli bilgileri hazırlayın
      const { senderWalletId, receiverAddress, amount } = {
        senderWalletId: userInfo.walletId,  // Örnek yer tutucu
        receiverAddress: "0x0006ce967d17b6878945398cf1cf9469767d8723", // Bu bilgiye sahip olmalısınız
        amount: selectedService.price 
      };
  
      // Transfer işlemini yapın
      const transferResponse = await http2.post('/api/transfer', {
        senderWalletId,
        receiverAddress,
        amount
      });
  
      // Transfer işleminin yanıtını kullanarak request güncellenir
      await http.put('/api/requests/transaction', {
        transactionId: transferResponse.data.id,
        requestId: createdRequest.id
      });
  
      // Form sıfırlama, yenileme ve modal kapama işlemleri
      resetForm();
      setRefresh(true);
      closeModal();
    } catch (error) {
      // Hata işleme
      console.log('Error:', error.response ? error.response.data.message : error.message);
      alert('Error: No avaible Employee at this time',  error.response.data.message);
    }
  };
  
  const handleServiceChange = (event) => {
    const selectedServiceId = event.target.value;
    const service = services.find(s => s.id === parseInt(selectedServiceId));
    setSelectedService(service);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={openModal}>
        Request Ekle
      </button>
      
      <div>
    {balance !== null ? (
      <p><strong>Wallet Balance:</strong> ${balance.toFixed(2)}</p>
    ) : (
      <p>Loading balance...</p>
    )}
  </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="request-modal"
        overlayClassName="request-modal-overlay"
        contentLabel="Request Creation Modal"
        ariaHideApp={false}
      >
        <div className="request-creation-module">
          <button className="btn-close" onClick={closeModal}>X</button>
          <h2>Request Creation</h2>
          <div>
    {balance !== null ? (
      <p><strong>Wallet Balance:</strong> ${balance.toFixed(2)}</p>
    ) : (
      <p>Loading balance...</p>
    )}
  </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="serviceId" className="form-label">
                    Select a Service
                  </label>
                  <Field as="select" id="serviceId" name="serviceId" className="form-control" onChange={(e) => {
                    handleServiceChange(e);
                    setFieldValue('serviceId', e.target.value);
                  }}>
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.serviceName}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="serviceId" component="div" className="text-danger" />
                </div>

                {selectedService && (
                  <div className="mb-3">
                    <p><strong>Description:</strong> {selectedService.description}</p>
                    <p><strong>Process Time in Hours:</strong> {selectedService.processTimeInHours}</p>
                    <p><strong>Price:</strong> {selectedService.price}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="startTime" className="form-label">
                    Start Time
                  </label>
                  <Field type="datetime-local" id="startTime" name="startTime" className="form-control" />
                  <ErrorMessage name="startTime" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="endTime" className="form-label">
                    End Time
                  </label>
                  <Field type="datetime-local" id="endTime" name="endTime" className="form-control" />
                  <ErrorMessage name="endTime" component="div" className="text-danger" />
                </div>

                <button type="submit" className="btn btn-primary">
                  Create Request
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default RequestCreation;
