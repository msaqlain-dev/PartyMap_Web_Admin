import {
  Input as AntInput,
  Select as AntSelect,
  Upload as AntUpload,
  Button,
  Form,
  InputNumber as AntInputNumber,
  DatePicker as AntDatePicker,
  TimePicker as AntTimePicker,
  Switch as AntSwitch,
  Radio as AntRadio,
  Checkbox as AntCheckbox,
  Rate as AntRate,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { TextArea: AntTextArea } = AntInput;
const { Dragger } = AntUpload;

// Generic Input Component
export const Input = ({
  label,
  name,
  placeholder,
  type = "text",
  size = "large",
  prefix,
  suffix,
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      {type === "password" ? (
        <AntInput.Password
          placeholder={placeholder}
          size={size}
          prefix={prefix}
          suffix={suffix}
          disabled={disabled}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          {...props}
        />
      ) : (
        <AntInput
          type={type}
          placeholder={placeholder}
          size={size}
          prefix={prefix}
          suffix={suffix}
          disabled={disabled}
          {...props}
        />
      )}
    </Form.Item>
  );
};

// Generic Select Component
export const Select = ({
  label,
  name,
  placeholder = "Please select",
  options = [],
  mode,
  size = "large",
  disabled = false,
  allowClear = true,
  showSearch = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntSelect
        placeholder={placeholder}
        options={options}
        mode={mode}
        size={size}
        disabled={disabled}
        allowClear={allowClear}
        showSearch={showSearch}
        filterOption={(input, option) =>
          showSearch
            ? (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            : true
        }
        {...props}
      />
    </Form.Item>
  );
};

// Generic TextArea Component
export const TextArea = ({
  label,
  name,
  placeholder,
  rows = 4,
  maxLength,
  showCount = false,
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntTextArea
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        showCount={showCount}
        disabled={disabled}
        {...props}
      />
    </Form.Item>
  );
};

// Generic Upload Component
export const Upload = ({
  label,
  name,
  accept = "image/*",
  maxCount = 1,
  listType = "picture",
  uploadType = "drag", // "drag" or "button"
  buttonText = "Click to Upload",
  dragText = "Click or drag file to this area to upload",
  hint = "Support for a single or bulk upload.",
  disabled = false,
  rules = [],
  className = "",
  beforeUpload = () => false, // Prevent auto upload by default
  onChange,
  ...props
}) => {
  const uploadProps = {
    accept,
    maxCount,
    listType,
    beforeUpload,
    disabled,
    onChange,
    ...props,
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={className}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      }}
    >
      {uploadType === "drag" ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{dragText}</p>
          <p className="ant-upload-hint">{hint}</p>
        </Dragger>
      ) : (
        <AntUpload {...uploadProps}>
          <Button icon={<UploadOutlined />} disabled={disabled}>
            {buttonText}
          </Button>
        </AntUpload>
      )}
    </Form.Item>
  );
};

// Generic InputNumber Component
export const InputNumber = ({
  label,
  name,
  placeholder,
  min,
  max,
  step = 1,
  size = "large",
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntInputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        size={size}
        disabled={disabled}
        style={{ width: "100%" }}
        {...props}
      />
    </Form.Item>
  );
};

// Generic DatePicker Component
export const DatePicker = ({
  label,
  name,
  placeholder = "Select date",
  format = "YYYY-MM-DD",
  size = "large",
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntDatePicker
        placeholder={placeholder}
        format={format}
        size={size}
        disabled={disabled}
        style={{ width: "100%" }}
        {...props}
      />
    </Form.Item>
  );
};

// Generic TimePicker Component
export const TimePicker = ({
  label,
  name,
  placeholder = "Select time",
  format = "HH:mm",
  size = "large",
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntTimePicker
        placeholder={placeholder}
        format={format}
        size={size}
        disabled={disabled}
        style={{ width: "100%" }}
        {...props}
      />
    </Form.Item>
  );
};

// Generic Switch Component
export const Switch = ({
  label,
  name,
  checkedChildren = "ON",
  unCheckedChildren = "OFF",
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={className}
      valuePropName="checked"
    >
      <AntSwitch
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        disabled={disabled}
        {...props}
      />
    </Form.Item>
  );
};

// Generic Radio Group Component
export const RadioGroup = ({
  label,
  name,
  options = [],
  optionType = "default", // "default" or "button"
  buttonStyle = "outline", // "outline" or "solid"
  size = "large",
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntRadio.Group
        options={options}
        optionType={optionType}
        buttonStyle={buttonStyle}
        size={size}
        disabled={disabled}
        {...props}
      />
    </Form.Item>
  );
};

// Generic Checkbox Group Component
export const CheckboxGroup = ({
  label,
  name,
  options = [],
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntCheckbox.Group options={options} disabled={disabled} {...props} />
    </Form.Item>
  );
};

// Generic Rate Component
export const Rate = ({
  label,
  name,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  rules = [],
  className = "",
  ...props
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules} className={className}>
      <AntRate
        count={count}
        allowHalf={allowHalf}
        allowClear={allowClear}
        disabled={disabled}
        {...props}
      />
    </Form.Item>
  );
};

// Form validation rules helpers
export const validationRules = {
  required: (message = "This field is required") => ({
    required: true,
    message,
  }),
  email: (message = "Please enter a valid email") => ({
    type: "email",
    message,
  }),
  minLength: (min, message) => ({
    min,
    message: message || `Minimum ${min} characters required`,
  }),
  maxLength: (max, message) => ({
    max,
    message: message || `Maximum ${max} characters allowed`,
  }),
  pattern: (pattern, message) => ({
    pattern,
    message,
  }),
  url: (message = "Please enter a valid URL") => ({
    type: "url",
    message,
  }),
  number: (message = "Please enter a valid number") => ({
    type: "number",
    message,
  }),
};
