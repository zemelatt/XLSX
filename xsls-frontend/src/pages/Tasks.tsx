import React, { useEffect, useState } from "react";
// import { data } from "./Data";
import { Button, Input, Modal, Table, Upload } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getAllTasks, deleteTask, uploadTask, editTask } from "../_helpers/api";

const Tasks = () => {
  const [Data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [uploadModalVissible, setUploadModalVisible] = useState(false);
  const [edit, setEdit] = useState({
    id: "",
    ItemNo: "",
    Description: "",
    Unit: "",
    Qty: "",
    Rate: "",
    Amount: "",
    createdAt: "",
    updatedAt: "",
  });
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await getAllTasks();
      const jsonData = await response.data;
      console.log(jsonData);

      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    console.log(fetchData());
  }, []);
  const columns = [
    {
      key: "ItemNo",
      title: "Item No",
      dataIndex: "ItemNo",
    },
    {
      key: "Description",
      title: "Description",
      dataIndex: "Description",
    },
    {
      key: "Unit",
      title: "Unit",
      dataIndex: "Unit",
    },
    {
      key: "Qty",
      title: "Qty",
      dataIndex: "Qty",
    },
    {
      key: "Rate",
      title: "Rate",
      dataIndex: "Rate",
    },
    {
      key: "Amount",
      title: "Amount",
      dataIndex: "Amount",
    },

    {
      key: "action",
      title: "Actions",
      render: (record: any) => {
        return (
          <>
            <div className="flex">
              <EditOutlined
                style={{ color: "black" }}
                onClick={() => Edit(record)}
              />
              <DeleteOutlined
                style={{ color: "red" }}
                onClick={() => Delete(record)}
              />
            </div>
          </>
        );
      },
    },
  ];

  const Delete = (record: any) => {
    Modal.confirm({
      title: "Are you sure you want to delete this",
      onOk: async () => {
        await deleteTask(record.id);
        await fetchData();
      },
    });
  };
  const Edit = (record: any) => {
    setEdit(record);
    setVisible(true);
  };

  const handleEdit = async () => {
    await editTask(edit);
    setVisible(false);
    fetchData();
  };

  const handleUpload = async () => {
    // Handle the file upload logic here
    // For demonstration purposes, we will print the file to the console
    console.log(fileList);
    await uploadTask(fileList);
    setUploadModalVisible(false);
  };
  const ResetEditing = () => {
    setEdit({
      id: "",
      ItemNo: "",
      Description: "",
      Unit: "",
      Qty: "",
      Rate: "",
      Amount: "",
      createdAt: "",
      updatedAt: "",
    });
    setVisible(false);
  };

  return (
    <>
      <div className="app">
        <div>
          <Button onClick={() => setUploadModalVisible(true)}>Upload</Button>
          <Modal
            title="Upload File"
            open={uploadModalVissible}
            onOk={() => setUploadModalVisible(false)}
            onCancel={() => setUploadModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setUploadModalVisible(false)}>
                Cancel
              </Button>,
            ]}
          >
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList([fileList])}
            >
              <Button icon={<UploadOutlined />}>Select File(s)</Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              // disabled={fileList.length === 0}
            >
              Upload
            </Button>
          </Modal>
        </div>
        <div className="table">
          <Table dataSource={Data} columns={columns} pagination={false} />
        </div>
        <Modal
          title="Edit Details"
          open={visible}
          okText="Save"
          onCancel={() => ResetEditing()}
          onOk={() => {
            handleEdit();
          }}
        >
          <Input
            value={edit?.id}
            onChange={(e) => {
              console.log(e);
              setEdit((pre) => {
                return { ...pre, id: edit?.id };
              });
            }}
            style={{ display: "none" }}
          />
          <Input
            value={edit?.ItemNo}
            onChange={(e) => {
              setEdit((pre) => {
                return { ...pre, ItemNo: e.target.value };
              });
            }}
          />
          <Input
            value={edit?.Description}
            onChange={(e) => {
              setEdit((pre) => {
                return { ...pre, Description: e.target.value };
              });
            }}
          />
          <Input
            value={edit?.Amount}
            onChange={(e) => {
              setEdit((pre) => {
                return { ...pre, Amount: e.target.value };
              });
            }}
          />
          <Input
            value={edit?.Qty}
            onChange={(e) => {
              setEdit((pre: any) => {
                return { ...pre, Qty: e.target.value };
              });
            }}
          />
          <Input
            value={edit?.Rate}
            onChange={(e) => {
              setEdit((pre) => {
                return { ...pre, Rate: e.target.value };
              });
            }}
          />
          <Input
            value={edit?.Unit}
            onChange={(e) => {
              setEdit((pre) => {
                return { ...pre, Unit: e.target.value };
              });
            }}
          />
        </Modal>
        ;
      </div>
    </>
  );
};

export default Tasks;
