import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Input, validationRules } from "./forms";
import useAuthStore from "../store/authStore";
import { partyMapBranding } from "../assets/images";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [form] = Form.useForm();
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (values) => {
    try {
      clearError();
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      // Error is handled in the store
      console.error("Login failed:", err);
    }
  };

  const fillDemoCredentials = () => {
    form.setFieldsValue({
      email: "admin@partymap.com",
      password: "Admin@12345",
    });
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Background Pattern */}

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {/* Logo/Brand Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-80 my-5">
                <img src={partyMapBranding} alt="" />
              </div>
              <Title level={1} className="mb-2">
                Admin Portal
              </Title>
              <Text className="text-gray-600 text-lg">
                Welcome back to your dashboard
              </Text>
            </div>

            {/* Login Card */}
            <Card
              className="shadow-2xl border-0 rounded-2xl backdrop-blur-sm bg-white/95"
              bodyStyle={{ padding: "2rem" }}
            >
              {error && (
                <Alert
                  message="Login Failed"
                  description={error}
                  type="error"
                  showIcon
                  className="mb-6 rounded-lg"
                  closable
                  onClose={clearError}
                />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                autoComplete="off"
              >
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  prefix={<UserOutlined className="text-gray-400" />}
                  rules={[
                    validationRules.required("Please enter your email"),
                    validationRules.email("Please enter a valid email address"),
                  ]}
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  prefix={<LockOutlined className="text-gray-400" />}
                  rules={[
                    validationRules.required("Please enter your password"),
                    validationRules.minLength(
                      6,
                      "Password must be at least 6 characters"
                    ),
                  ]}
                  autoComplete="current-password"
                />

                <Form.Item className="mb-6 mt-8">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<LoginOutlined />}
                    block
                    size="large"
                    className="h-14 text-lg font-medium rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Signing In..." : "Sign In to Dashboard"}
                  </Button>
                </Form.Item>
              </Form>

              <Divider className="my-6">
                <Text type="secondary" className="px-4">
                  Demo Access
                </Text>
              </Divider>

              <div className="text-center space-y-4">
                <Button
                  type="dashed"
                  onClick={fillDemoCredentials}
                  icon={<EyeOutlined />}
                  block
                  size="large"
                  className="h-12 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700"
                >
                  Use Demo Credentials
                </Button>

                {showDemo && (
                  <div className="bg-gray-50 rounded-xl p-4 text-left">
                    <Text className="text-sm text-gray-600 block mb-2">
                      <strong>Demo Account:</strong>
                    </Text>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Text className="text-xs text-gray-500">Email:</Text>
                        <Text code className="text-xs">
                          admin@partymap.com
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text className="text-xs text-gray-500">Password:</Text>
                        <Text code className="text-xs">
                          Admin@12345
                        </Text>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="link"
                  onClick={() => setShowDemo(!showDemo)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {showDemo ? "Hide" : "Show"} demo credentials
                </Button>
              </div>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8">
              <Text className="text-gray-500 text-sm">
                © 2024 Party Map Portal. All rights reserved.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
