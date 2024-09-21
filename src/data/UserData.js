export const rows = [
    { id: 1, email: 'jon.snow@example.com', phone: '+1234567890', role: 'buyer' },
    { id: 2, email: 'cersei.lannister@example.com', phone: '+1234567891', role: 'seller' },
    { id: 3, email: 'jaime.lannister@example.com', phone: '+1234567892', role: 'buyer' },
];

export const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone Number', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
        field: 'delete',
        headerName: 'Delete',
        sortable: false,
        width: 100,
        renderCell: (params) => {
            return (
                <button onClick={() => handleDelete(params.row.id)}>
                    Delete
                </button>
            );
        }
    }
];


export const handleDelete = (id) => {
    console.log('Delete row with ID:', id);
    // Implement deletion logic here
};