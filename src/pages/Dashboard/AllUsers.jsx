import React, { useEffect, useState } from 'react';
import { Space, Table, message, Button, Modal } from 'antd';
import axios from 'axios';

const { confirm } = Modal;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingKeys, setDeletingKeys] = useState([]);
  const [blockingKeys, setBlockingKeys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/all-users');
      const users = response.data.map(user => ({
        key: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        isBlocked: user.isBlocked,
      }));
      setData(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    setDeletingKeys(prevKeys => [...prevKeys, key]);
    try {
      await axios.delete(`http://localhost:5000/api/user/delete-user/${key}`);
      message.success('User deleted successfully');
      setData(data.filter(item => item.key !== key));
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setDeletingKeys(prevKeys => prevKeys.filter(k => k !== key));
    }
  };

  const handleBlockUnblock = async (key, isBlocked) => {
    setBlockingKeys(prevKeys => [...prevKeys, key]);
    try {
      if (isBlocked) {
        await axios.put(`http://localhost:5000/api/user/unblock/${key}`);
        message.success('User unblocked successfully');
      } else {
        await axios.put(`http://localhost:5000/api/user/block/${key}`);
        message.success('User blocked successfully');
      }
      fetchData();
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      message.error('Failed to block/unblock user');
    } finally {
      setBlockingKeys(prevKeys => prevKeys.filter(k => k !== key));
    }
  };

  const handleRowClick = async (key) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/user-by-id/${key}`);
      setSelectedUser(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Failed to fetch user details');
    }
  };

  const showDeleteConfirm = (key) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(key);
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => <p>{`${record.firstname} ${record.lastname}`}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked) => (
        <span style={{ color: isBlocked ? 'red' : 'green' }}>
          {isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
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
            Delete
          </Button>
          <Button
            type="primary"
            onClick={() => handleBlockUnblock(record.key, record.isBlocked)}
            loading={blockingKeys.includes(record.key)}
            disabled={blockingKeys.includes(record.key)}
            style={{ cursor: 'pointer' }}
          >
            {record.isBlocked ? 'Unblock' : 'Block'}
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
        title="User Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>First Name:</strong> {selectedUser.firstname}</p>
            <p><strong>Last Name:</strong> {selectedUser.lastname}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
            <p><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DataTable;
