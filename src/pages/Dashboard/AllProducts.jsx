import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, message, Rate } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product/get-all-products');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/product/delete-product/${id}`);
      message.success('Product deleted successfully');
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/get-product-by-id/${id}`);
      setSelectedProduct(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (images) => images && images.length > 0 ? <img src={images[0].url} alt="product" style={{ width: 50, height: 50 }} /> : 'No Image',
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (price) => `$${price}`,
      ...getColumnSearchProps('price'),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
      sorter: (a, b) => a.category.length - b.category.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button  type="primary" onClick={() => handleShowDetails(record._id)}>Detail</Button>
          <Button type="primary" danger onClick={() => showDeleteConfirm(record._id)}>Delete</Button>
          <Button type="primary" onClick={() => navigate(`/dashboard/update-product/${record._id}`)}>Update</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Button style={{ background: "red", color: "white", fontWeight: "600", width: "150px", height: "40px" }} onClick={() => navigate('/dashboard/add-product')}>
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title="Product Details"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000} // Increase the width here
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {selectedProduct && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Title:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.title}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Description:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.description}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Price:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>${selectedProduct.price}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Category:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.category}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Brand:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.brand}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Quantity:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.quantity}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Sold:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.sold}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Tags:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.tags.join(', ')}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Total Rating:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><Rate disabled defaultValue={selectedProduct.totalrating} /></td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Warranty:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.warranty} years</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Return Policy:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.returnPolicy}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Weight:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.weight} kg</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Dimensions:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{`${selectedProduct.dimensions.length} x ${selectedProduct.dimensions.width} x ${selectedProduct.dimensions.height} cm`}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Colors:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{selectedProduct.color.join(', ')}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>Images:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selectedProduct.images.map(image => (
                      <img key={image.public_id} src={image.url} alt="product" style={{ width: 'calc(50% - 10px)', height: 'auto', marginRight: 10, marginBottom: 10 }} />
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: 8 }}><strong>360° Images:</strong></td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selectedProduct.images360.map(image => (
                      <img key={image.public_id} src={image.url} alt="product 360" style={{ width: 'calc(50% - 10px)', height: 'auto', marginRight: 10, marginBottom: 10 }} />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default AllProducts;
