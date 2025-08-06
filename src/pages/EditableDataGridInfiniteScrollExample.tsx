import React, { useState, useCallback } from 'react';
import EditableDataGrid from '../components/organisms/data-grids/EditableDataGrid';
import { DataGridColumn, DataGridData } from '../types';

// Generate dummy data
const generateDummyData = (start: number, count: number): DataGridData[] => {
  const data: DataGridData[] = [];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const statuses = ['Active', 'Inactive', 'Pending'];
  const longNames = [
    'John Smith',
    'Alice Johnson with a very long last name that should wrap',
    'Bob Brown',
    'Carol Davis-Wilson-Thompson',
    'David Miller',
    'Eva Garcia-Rodriguez',
    'Frank Wilson',
    'Grace Lee-Chen'
  ];
  
  for (let i = start; i < start + count; i++) {
    // Mix of short and long names to test wrapping
    const nameIndex = i % longNames.length;
    const name = longNames[nameIndex] + ` (${i})`;
    
    data.push({
      id: i,
      name,
      email: `employee${i}@company-with-long-domain-name.com`,
      department: departments[i % departments.length],
      status: statuses[i % statuses.length],
      salary: Math.floor(Math.random() * 100000) + 40000,
      joinDate: new Date(2020 + Math.floor(i / 100), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
      phone: `+1-555-${String(i).padStart(4, '0')}`,
    });
  }
  
  return data;
};

const EditableDataGridInfiniteScrollExample: React.FC = () => {
  const [data, setData] = useState<DataGridData[]>(() => generateDummyData(0, 50));
  const [hasNextPage, setHasNextPage] = useState(true);

  const columns: DataGridColumn[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      filterable: true,
      editable: true,
      width: '150px',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      filterable: true,
      editable: true,
      width: '200px',
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'select',
      editorProps: {
        options: [
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'HR', label: 'HR' },
          { value: 'Finance', label: 'Finance' },
        ],
      },
      width: '120px',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'select',
      editorProps: {
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
          { value: 'Pending', label: 'Pending' },
        ],
      },
      width: '100px',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'salary',
      title: 'Salary',
      dataIndex: 'salary',
      sortable: true,
      filterable: true,
      editable: true,
      width: '120px',
      render: (value: number) => `$${value?.toLocaleString() || 0}`,
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      dataIndex: 'joinDate',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'datepicker',
      width: '120px',
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'phone',
      sortable: true,
      filterable: true,
      editable: true,
      width: '140px',
    },
  ];

  // Simulate API call for loading more data
  const handleLoadMore = useCallback(async (cursor?: string | number): Promise<{
    data: DataGridData[];
    nextCursor?: string | number;
    hasNextPage: boolean;
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentLength = data.length;
    const newData = generateDummyData(currentLength, 25);
    const nextHasMore = currentLength + newData.length < 500; // Limit to 500 total records

    return {
      data: newData,
      nextCursor: currentLength + newData.length,
      hasNextPage: nextHasMore,
    };
  }, [data.length]);

  const handleCellEdit = useCallback((value: any, record: DataGridData, column: DataGridColumn) => {
    console.log('Cell edited:', { value, record, column });
    
    // Update the data
    setData(prevData => 
      prevData.map(item => 
        item.id === record.id 
          ? { ...item, [column.key!]: value }
          : item
      )
    );
  }, []);

  const handleRowAdd = useCallback(() => {
    const newId = Math.max(...data.map(d => Number(d.id))) + 1;
    const newRow: DataGridData = {
      id: newId,
      name: `New Employee ${newId}`,
      email: `new${newId}@company.com`,
      department: 'Engineering',
      status: 'Pending',
      salary: 50000,
      joinDate: new Date().toISOString().split('T')[0],
      phone: `+1-555-${String(newId).padStart(4, '0')}`,
    };
    
    setData(prevData => [...prevData, newRow]);
  }, [data]);

  const handleRowDelete = useCallback((record: DataGridData) => {
    console.log('Row deleted:', record);
    setData(prevData => prevData.filter(item => item.id !== record.id));
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          EditableDataGrid with Infinite Scroll
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <EditableDataGrid
          id="infinite-scroll-example"
          columns={columns}
          data={data}
          editable={true}
          infiniteScroll={{
            enabled: true,
            hasNextPage,
            threshold: 200,
            onLoadMore: handleLoadMore,
            showLoader: false,
            onStateChange: (state) => {
              setHasNextPage(state.hasNextPage);
            },
          }}
          virtualization={{
            enabled: true,
            itemHeight: 35,
            containerHeight: 600,
            overscan: 3,
          }}
          selection={{
            type: 'checkbox',
          }}
          sortable={true}
          filterable={true}
          exportable={true}
          allowedActions={[
            'edit_completed',
            'edit_rows',
            'delete_rows',
            'bulk_delete',
            'bulk_edit',
          ]}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          onRowClick={(record, index) => {
            console.log('Row clicked:', record, index);
          }}
          onSort={(columnKey, direction) => {
            console.log('Sort:', columnKey, direction);
          }}
          onFilter={(filters) => {
            console.log('Filter:', filters);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default EditableDataGridInfiniteScrollExample;