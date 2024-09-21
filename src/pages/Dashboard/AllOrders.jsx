import React, { useEffect, useState } from 'react';
import { Space, Table, message, Button, Modal } from 'antd';
import axios from 'axios';

const { confirm } = Modal;

const OrderTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingKeys, setDeletingKeys] = useState([]);
  const [cancellingKeys, setCancellingKeys] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/all');
      const orders = response.data.map(order => {
        const totalAmount = order?.products.reduce((acc, item) => {
          if (item.product) {
            return acc + item?.product?.price * item?.quantity;
          }
          return acc;
        }, 0);
        // const totalAmount =9;

        const productTitles = order.products.map(item => item.product ? item?.product.title : 'Unknown Product').join(', ');

        return {
          key: order._id,
          user: `${order?.user?.firstname} ${order?.user?.lastname}`,
          products: productTitles,
          amount: totalAmount,
          quantity: order.products.reduce((acc, item) => acc + item.quantity, 0),
          status: order.status,
          deliveryTime: new Date(order.deliveryTime).toLocaleString(),
          createdAt: new Date(order.createdAt).toLocaleString(),
          updatedAt: new Date(order.updatedAt).toLocaleString(),
        };
      });
      setData(orders);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    setDeletingKeys(prevKeys => [...prevKeys, key]);
    try {
      await axios.delete(`http://localhost:5000/api/orders/remove/${key}`);
      message.success('Order removed successfully');
      setData(data.filter(item => item.key !== key));
    } catch (error) {
      console.error('Error removing order:', error);
      message.error('Failed to remove order');
    } finally {
      setDeletingKeys(prevKeys => prevKeys.filter(k => k !== key));
    }
  };

  const handleCancel = async (key) => {
    setCancellingKeys(prevKeys => [...prevKeys, key]);
    try {
      await axios.put(`http://localhost:5000/api/orders/cancel`, { orderId: key });
      message.success('Order cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Error cancelling order:', error);
      message.error('Failed to cancel order');
    } finally {
      setCancellingKeys(prevKeys => prevKeys.filter(k => k !== key));
    }
  };

  const handleRowClick = async (key) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/order-by-id/${key}`);
      setSelectedOrder(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Failed to fetch order details');
    }
  };

  const showDeleteConfirm = (key) => {
    confirm({
      title: 'Are you sure you want to remove this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(key);
      },
    });
  };

  const showCancelConfirm = (key) => {
    confirm({
      title: 'Are you sure you want to cancel this order?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleCancel(key);
      },
    });
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleRowClick(record.key)}
            style={{ cursor: 'pointer' }}
          >
            Detail
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => showDeleteConfirm(record.key)}
            loading={deletingKeys.includes(record.key)}
            disabled={deletingKeys.includes(record.key)}
            style={{ cursor: 'pointer' }}
          >
            Remove
          </Button>
          <Button
            type="primary"
            onClick={() => showCancelConfirm(record.key)}
            loading={cancellingKeys.includes(record.key)}
            disabled={cancellingKeys.includes(record.key) || record.status === 'Cancelled'}
            style={{ cursor: 'pointer' }}
          >
            Cancel
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: "calc(100vh - 100px)", width: '100%', backgroundColor: 'white' }}>
      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        pagination={{ pageSize: 8 }} 
        rowClassName={() => 'custom-row-height'} 
      />
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p><strong>User:</strong> {`${selectedOrder.user.firstname} ${selectedOrder.user.lastname}`}</p>
            <p><strong>Amount:</strong> {`${selectedOrder.currency} ${selectedOrder.amount}`}</p>
            <p><strong>Delivery Time:</strong> {new Date(selectedOrder.deliveryTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Products:</strong> {selectedOrder.products.map(p => p.product ? p.product.title : 'Unknown Product').join(', ')}</p>
            <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTable;
