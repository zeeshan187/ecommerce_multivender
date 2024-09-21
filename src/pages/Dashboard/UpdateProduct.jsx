import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload, Select, message, Row, Col, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const colors = [
  "Red", "Green", "Blue", "Yellow", "Black", "White", "Pink", "Purple", "Orange", "Brown",
  "Gray", "Cyan", "Magenta", "Lime", "Maroon", "Navy", "Olive", "Teal", "Silver", "Gold"
];

const tags = [
  "Electronics", "Fashion", "Home", "Garden", "Toys", "Sports", "Automotive", "Books", "Movies", "Music",
  "Health", "Beauty", "Grocery", "Office", "Industrial", "Tools", "Travel", "Pets", "Art", "Crafts"
];

const UpdateProduct = () => {
  const [form] = Form.useForm();
  const [imageFiles, setImageFiles] = useState([]);
  const [image360Files, setImage360Files] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const { id } = useParams(); // To get the product id from the URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/get-product-by-id/${id}`);
      setProduct(response.data);
      form.setFieldsValue({
        ...response.data,
        dimensions: response.data.dimensions,
        color: response.data.color,
        tags: response.data.tags
      }); // Populate form with product data
    } catch (error) {
      console.error('Error fetching product:', error);
      message.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    const { dimensions, ...otherValues } = values;

    Object.keys(otherValues).forEach(key => {
      if (Array.isArray(otherValues[key])) {
        otherValues[key].forEach(item => formData.append(key, item));
      } else {
        formData.append(key, otherValues[key]);
      }
    });

    formData.append('dimensions', JSON.stringify(dimensions));

    imageFiles.forEach(file => formData.append('images', file));
    image360Files.forEach(file => formData.append('images360', file));

    try {
      await axios.put(`http://localhost:5000/api/product/update-product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Product updated successfully!');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadChange = (info, setImageFiles) => {
    const fileList = [...info.fileList].slice(-4); // Limit to 4 files
    setImageFiles(fileList.map(file => file.originFileObj));
  };

  if (loading) {
    return <Spin style={{ display: 'block', margin: 'auto', marginTop: '20%' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Update Product</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          discountPrice: 0,
          sold: 0,
          color: [],
          tags: [],
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
          },
          weight: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the product title' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter the product slug' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the product description' }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the product price' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="discountPrice" label="Discount Price">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter the product category' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Please enter the product brand' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter the product quantity' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sold" label="Sold">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="color" label="Color">
              <Select mode="tags" placeholder="Select colors">
                {colors.map(color => (
                  <Option key={color} value={color}>{color}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Select mode="tags" placeholder="Select tags">
                {tags.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="warranty" label="Warranty">
              <Input />
            </Form.Item>
            <Form.Item name="returnPolicy" label="Return Policy">
              <Input />
            </Form.Item>
            <Form.Item name={['dimensions', 'length']} label="Length" rules={[{ required: true, message: 'Please enter the product length' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['dimensions', 'width']} label="Width" rules={[{ required: true, message: 'Please enter the product width' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['dimensions', 'height']} label="Height" rules={[{ required: true, message: 'Please enter the product height' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="weight" label="Weight" rules={[{ required: true, message: 'Please enter the product weight' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Product Images" rules={[{ required: true, message: 'Please upload product images' }]}>
              <Upload
                listType="picture"
                multiple
                beforeUpload={() => false} // Prevent automatic upload
                onChange={(info) => handleUploadChange(info, setImageFiles)}
                defaultFileList={product.images.map(image => ({
                  uid: image.public_id,
                  name: image.url.split('/').pop(),
                  status: 'done',
                  url: image.url,
                }))}
              >
                <Button icon={<UploadOutlined />}>Upload (max 4)</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="360 Images">
              <Upload
                listType="picture"
                multiple
                beforeUpload={() => false} // Prevent automatic upload
                onChange={(info) => handleUploadChange(info, setImage360Files)}
                defaultFileList={product.images360.map(image => ({
                  uid: image.public_id,
                  name: image.url.split('/').pop(),
                  status: 'done',
                  url: image.url,
                }))}
              >
                <Button icon={<UploadOutlined />}>Upload (max 4)</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateProduct;
