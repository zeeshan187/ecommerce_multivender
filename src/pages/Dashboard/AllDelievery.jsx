import React from 'react'
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Product',
    dataIndex: 'product',
    key: 'product',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: '1',
    product: 'Shirt',
    user: "Zeeshan",
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    product: 'Headphones',
    user: "Mudassar",
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    product: 'Laptop',
    user: "Salman",
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
const AllDelievery = () => {
  return (
    <div>
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default AllDelievery