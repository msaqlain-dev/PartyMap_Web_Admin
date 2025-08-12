import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Steps,
  message,
  Input,
  InputNumber,
  Switch,
  Slider,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  FormikInput,
  FormikSelect,
  FormikTextArea,
  FormikInputNumber,
} from "../../components/forms";
import {
  polygonValidationSchema,
  polygonStepValidationSchemas,
} from "../../validation/schemas";
import { polygonService } from "../../services/polygonService";
import { markerService } from "../../services/markerService";

const { Title, Text } = Typography;

export default function AddPolygon() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  const steps = [
    {
      title: "Basic Info",
      description: "Name and type",
    },
    {
      title: "Geometry",
      description: "Coordinates",
    },
    {
      title: "Styling",
      description: "Visual properties",
    },
  ];

  const polygonTypeOptions = [
    { label: "Building", value: "building" },
    { label: "Area", value: "area" },
    { label: "Zone", value: "zone" },
    { label: "Boundary", value: "boundary" },
    { label: "Venue", value: "venue" },
    { label: "Park", value: "park" },
    { label: "Parking", value: "parking" },
    { label: "Other", value: "other" },
  ];

  const initialValues = {
    name: "",
    description: "",
    polygonType: "building",
    geometry: {
      outerRing: {
        coordinates: [
          { longitude: -74.006, latitude: 40.7128 },
          { longitude: -74.005, latitude: 40.7128 },
          { longitude: -74.005, latitude: 40.7138 },
          { longitude: -74.006, latitude: 40.7138 },
          { longitude: -74.006, latitude: 40.7128 },
        ],
      },
      holes: [],
    },
    style: {
      fillColor: "#0000FF",
      fillOpacity: 0.8,
      strokeColor: "#000000",
      strokeWidth: 1,
      strokeOpacity: 1,
    },
    extrusion: {
      height: 50,
      base: 0,
      color: "#0000FF",
      opacity: 0.8,
    },
    marker: null,
    isVisible: true,
    isInteractive: true,
    minZoom: 0,
    maxZoom: 24,
  };

  // Fetch markers for association
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await markerService.getAllMarkersWithoutPagination();
        setMarkers(response.data || []);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    fetchMarkers();
  }, []);

  const handleFinalSubmit = async (values) => {
    setLoading(true);
    try {
      await polygonService.createPolygon(values);
      message.success("Polygon created successfully!");
      navigate("/polygons");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error creating polygon");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (validateForm, values) => {
    const stepSchema = polygonStepValidationSchemas[`step${currentStep + 1}`];

    try {
      if (stepSchema) {
        await stepSchema.validate(values, { abortEarly: false });
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      if (error.inner) {
        validateForm();
      }
      message.error("Please fill in all required fields correctly");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderBasicInfo = () => (
    <Card>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <FormikInput
            name="name"
            label="Polygon Name"
            placeholder="Enter polygon name"
          />
        </Col>

        <Col xs={24} md={12}>
          <FormikSelect
            name="polygonType"
            label="Polygon Type"
            placeholder="Select polygon type"
            options={polygonTypeOptions}
          />
        </Col>

        <Col xs={24}>
          <FormikTextArea
            name="description"
            label="Description"
            placeholder="Enter polygon description"
            rows={3}
            maxLength={500}
            showCount
          />
        </Col>

        <Col xs={24} md={12}>
          <FormikSelect
            name="marker"
            label="Associated Marker (Optional)"
            placeholder="Select a marker"
            allowClear
            options={markers.map((marker) => ({
              label: `${marker.placeName} (${marker.markerType})`,
              value: marker._id,
            }))}
          />
        </Col>
      </Row>
    </Card>
  );

  const CoordinateInput = ({ coordinates, onChange, label }) => {
    const handleCoordinateChange = (index, field, value) => {
      const newCoordinates = [...coordinates];
      newCoordinates[index] = { ...newCoordinates[index], [field]: value };
      onChange(newCoordinates);
    };

    const addCoordinate = () => {
      const newCoordinate = { longitude: 0, latitude: 0 };
      onChange([...coordinates, newCoordinate]);
    };

    const removeCoordinate = (index) => {
      if (coordinates.length > 4) {
        const newCoordinates = coordinates.filter((_, i) => i !== index);
        onChange(newCoordinates);
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text strong>{label}</Text>
          <Button type="dashed" onClick={addCoordinate} size="small">
            Add Coordinate
          </Button>
        </div>
        {coordinates.map((coord, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <Text className="text-xs text-gray-500">Longitude</Text>
              <InputNumber
                value={coord.longitude}
                onChange={(value) =>
                  handleCoordinateChange(index, "longitude", value)
                }
                placeholder="Longitude"
                style={{ width: "100%" }}
                step={0.000001}
                precision={6}
              />
            </div>
            <div className="flex-1">
              <Text className="text-xs text-gray-500">Latitude</Text>
              <InputNumber
                value={coord.latitude}
                onChange={(value) =>
                  handleCoordinateChange(index, "latitude", value)
                }
                placeholder="Latitude"
                style={{ width: "100%" }}
                step={0.000001}
                precision={6}
              />
            </div>
            {coordinates.length > 4 && (
              <Button
                type="text"
                danger
                onClick={() => removeCoordinate(index)}
                size="small"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Text type="secondary" className="text-xs">
          Note: First and last coordinates should be the same to close the
          polygon
        </Text>
      </div>
    );
  };

  const renderGeometry = ({ values, setFieldValue }) => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <CoordinateInput
            coordinates={values.geometry.outerRing.coordinates}
            onChange={(coordinates) => {
              setFieldValue("geometry.outerRing.coordinates", coordinates);
            }}
            label="Outer Ring Coordinates"
          />
        </Col>
      </Row>
    </Card>
  );

  const ColorPicker = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <Text strong>{label}</Text>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 50, height: 32, padding: 0, border: "none" }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );

  const renderStyling = ({ values, setFieldValue }) => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="Fill Properties">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ColorPicker
              value={values.style.fillColor}
              onChange={(color) => setFieldValue("style.fillColor", color)}
              label="Fill Color"
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-2">
              <Text strong>Fill Opacity</Text>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={values.style.fillOpacity}
                onChange={(value) => setFieldValue("style.fillOpacity", value)}
                marks={{ 0: "0%", 0.5: "50%", 1: "100%" }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="Stroke Properties">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <ColorPicker
              value={values.style.strokeColor}
              onChange={(color) => setFieldValue("style.strokeColor", color)}
              label="Stroke Color"
            />
          </Col>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <Text strong>Stroke Width</Text>
              <InputNumber
                min={0}
                max={10}
                value={values.style.strokeWidth}
                onChange={(value) => setFieldValue("style.strokeWidth", value)}
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <Text strong>Stroke Opacity</Text>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={values.style.strokeOpacity}
                onChange={(value) =>
                  setFieldValue("style.strokeOpacity", value)
                }
                marks={{ 0: "0%", 0.5: "50%", 1: "100%" }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="3D Extrusion">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <Text strong>Height (meters)</Text>
              <InputNumber
                min={0}
                max={1000}
                value={values.extrusion.height}
                onChange={(value) => setFieldValue("extrusion.height", value)}
                style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <ColorPicker
              value={values.extrusion.color}
              onChange={(color) => setFieldValue("extrusion.color", color)}
              label="Extrusion Color"
            />
          </Col>
          <Col xs={24} md={8}>
            <div className="space-y-2">
              <Text strong>Extrusion Opacity</Text>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={values.extrusion.opacity}
                onChange={(value) => setFieldValue("extrusion.opacity", value)}
                marks={{ 0: "0%", 0.5: "50%", 1: "100%" }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="Visibility Settings">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <div className="flex items-center justify-between">
              <Text strong>Visible</Text>
              <Switch
                checked={values.isVisible}
                onChange={(checked) => setFieldValue("isVisible", checked)}
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="flex items-center justify-between">
              <Text strong>Interactive</Text>
              <Switch
                checked={values.isInteractive}
                onChange={(checked) => setFieldValue("isInteractive", checked)}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </Space>
  );

  const renderStepContent = (formikProps) => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderGeometry(formikProps);
      case 2:
        return renderStyling(formikProps);
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/polygons")}
          className="mb-4"
        >
          Back to Polygons
        </Button>

        <Title level={2} className="mb-2">
          Add New Polygon
        </Title>
        <Text type="secondary">Create a new 3D polygon shape for your map</Text>
      </div>

      {/* Steps */}
      <Card className="mb-6">
        <Steps current={currentStep} items={steps} className="mb-6" />
      </Card>

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={polygonValidationSchema}
        onSubmit={() => {}}
        enableReinitialize
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            validateForm,
            isSubmitting,
            setFieldValue,
          } = formikProps;

          return (
            <div>
              {renderStepContent({ values, setFieldValue })}

              {/* Navigation Buttons */}
              <Card className="mt-6">
                <div className="flex justify-between">
                  <div>
                    {currentStep > 0 && (
                      <Button size="large" onClick={handlePrev}>
                        Previous
                      </Button>
                    )}
                  </div>

                  <Space>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleNext(validateForm, values)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={() => handleFinalSubmit(values)}
                      >
                        Create Polygon
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}
