import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { changePasswordSchema } from "../common/validationSchema";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordModal = ({
  isVisible,
  toggleModal,
  handleChangePassword, // Pass this function from parent for actual password change logic
}) => {
  const [form] = Form.useForm();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Validate password using the schema or custom logic
  const validatePassword = (password) => {
    try {
      changePasswordSchema.parse({ newPassword: password }); // Validate against Zod schema
      setErrors({})
      setIsPasswordValid(true); // Set to true when validation passes
    } catch (err) {
      setIsPasswordValid(false); // Set to false when validation fails
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors); // Display error messages
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  // Handle form submission
  const onFinish = (values) => {
    handleChangePassword(values); // Pass the form values to parent
  };

  return (
    <Modal
      title="Change Password"
      open={isVisible}
      onCancel={toggleModal}
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        {/* Current Password */}
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            {
              required: true,
              message: "Please input your current password!",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your current password"
            className="hover:!border-[#00ABCD] focus:!border-[#00ABCD]"
          />
        </Form.Item>

        {/* New Password with Validation */}
        <Form.Item label="New Password" name="newPassword">
          <Input.Password
            className={`hover:!border-[#00ABCD] focus:!border-[#00ABCD] ${
              errors.newPassword
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value); // Validate password on input change
            }}
          />

          <div className="min-h-[24px] mt-1">
            {newPassword.length > 0 && (
              <>
                {errors?.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
                {isPasswordValid && !errors?.newPassword && (
                  <p className="text-green-500 text-sm">Password is valid</p>
                )}
              </>
            )}
          </div>
        </Form.Item>

        {/* Form Actions */}
        <Form.Item>
          <Button
            className="bg-[#00ABCD] text-white hover:!bg-[#2dc6e5] hover:!text-white"
            htmlType="submit"
            disabled={!isPasswordValid}
          >
            Submit
          </Button>
          <Button
            type="default"
            onClick={toggleModal}
            className="ml-2 hover:!border-[#00ABCD] hover:!text-[#00ABCD]"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </Modal>
  );
};

export default ChangePasswordModal;