import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  FormikInput,
  FormikSelect,
  FormikTextArea,
} from "../../components/forms";
import {
  polygonValidationSchema,
  polygonStepValidationSchemas,
} from "../../validation/schemas";
import { polygonService } from "../../services/polygonService";
import { markerService } from "../../services/markerService";

const { Title, Text } = Typography;

export default function EditPolygon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [markersLoading, setMarkersLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

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

  // Fetch polygon data and markers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Fetch polygon data
        const polygonResponse = await polygonService.getPolygon(id);
        const polygonData = polygonResponse.data;

        console.log("Fetched polygon data:", polygonData);

        // Fetch markers
        setMarkersLoading(true);
        const markersResponse = await markerService.getMarkers({ limit: 1000 });
        setMarkers(markersResponse.data || []);
        setMarkersLoading(false);

        // Prepare initial values
        const formData = {
          name: polygonData.name || "",
          description: polygonData.description || "",
          polygonType: polygonData.polygonType || "building",
          geometry: {
            type: "Polygon",
            coordinates: polygonData.geometry?.coordinates || [
              [
                [-74.006, 40.7128],
                [-74.005, 40.7128],
                [-74.005, 40.7138],
                [-74.006, 40.7138],
                [-74.006, 40.7128],
              ],
            ],
          },
          style: {
            fillColor: polygonData.style?.fillColor || "#0000FF",
            fillOpacity: polygonData.style?.fillOpacity || 0.8,
            strokeColor: polygonData.style?.strokeColor || "#000000",
            strokeWidth: polygonData.style?.strokeWidth || 1,
            strokeOpacity: polygonData.style?.strokeOpacity || 1,
          },
          extrusion: {
            height: polygonData.extrusion?.height || 50,
            base: polygonData.extrusion?.base || 0,
            color: polygonData.extrusion?.color || "#0000FF",
            opacity: polygonData.extrusion?.opacity || 0.8,
          },
          marker: polygonData.marker?._id || null,
          isVisible:
            polygonData.isVisible !== undefined ? polygonData.isVisible : true,
          isInteractive:
            polygonData.isInteractive !== undefined
              ? polygonData.isInteractive
              : true,
          minZoom: polygonData.minZoom || 0,
          maxZoom: polygonData.maxZoom || 24,
        };

        setInitialValues(formData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load polygon data");
        message.error("Failed to load polygon data");
      } finally {
        setInitialLoading(false);
        setMarkersLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleFinalSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare geometry data in GeoJSON format
      const polygonData = {
        ...values,
        geometry: {
          type: "Polygon",
          coordinates: values.geometry.coordinates,
        },
      };

      console.log("Updating polygon data:", polygonData);
      await polygonService.updatePolygon(id, polygonData);
      message.success("Polygon updated successfully!");
      navigate("/polygons");
    } catch (error) {
      console.error("Error updating polygon:", error);
      message.error(error.message || "Error updating polygon");
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

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Loading polygon data...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/polygons")}
          className="mb-4"
        >
          Back to Polygons
        </Button>

        <Alert
          message="Error Loading Polygon"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert
          message="Polygon Not Found"
          description="The requested polygon could not be found."
          type="warning"
          showIcon
        />
      </div>
    );
  }

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
            placeholder={
              markersLoading ? "Loading markers..." : "Select a marker"
            }
            allowClear
            showSearch
            loading={markersLoading}
            disabled={markersLoading}
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
      if (field === "longitude") {
        newCoordinates[index] = [value, newCoordinates[index][1]];
      } else {
        newCoordinates[index] = [newCoordinates[index][0], value];
      }
      onChange(newCoordinates);
    };

    const addCoordinate = () => {
      const newCoordinate = [0, 0];
      const newCoordinates = [...coordinates];
      newCoordinates.splice(-1, 0, newCoordinate); // Insert before last coordinate (to maintain closure)
      onChange(newCoordinates);
    };

    const removeCoordinate = (index) => {
      if (coordinates.length > 4) {
        const newCoordinates = coordinates.filter((_, i) => i !== index);
        // Ensure polygon is still closed
        if (index === 0) {
          // If removing first coordinate, update last coordinate to match new first
          newCoordinates[newCoordinates.length - 1] = newCoordinates[0];
        } else if (index === coordinates.length - 1) {
          // If removing last coordinate, update it to match first
          newCoordinates[newCoordinates.length - 1] = newCoordinates[0];
        }
        onChange(newCoordinates);
      }
    };

    const ensureClosure = () => {
      if (coordinates.length >= 4) {
        const newCoordinates = [...coordinates];
        newCoordinates[newCoordinates.length - 1] = newCoordinates[0];
        onChange(newCoordinates);
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Text strong>{label}</Text>
          <Space>
            <Button type="dashed" onClick={addCoordinate} size="small">
              Add Coordinate
            </Button>
            <Button onClick={ensureClosure} size="small">
              Close Polygon
            </Button>
          </Space>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {coordinates.map((coord, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <Text className="text-xs text-gray-500">Longitude</Text>
                <InputNumber
                  value={coord[0]}
                  onChange={(value) =>
                    handleCoordinateChange(index, "longitude", value || 0)
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
                  value={coord[1]}
                  onChange={(value) =>
                    handleCoordinateChange(index, "latitude", value || 0)
                  }
                  placeholder="Latitude"
                  style={{ width: "100%" }}
                  step={0.000001}
                  precision={6}
                />
              </div>
              <div className="text-xs text-gray-500 w-8">#{index + 1}</div>
              {coordinates.length > 4 &&
                index !== 0 &&
                index !== coordinates.length - 1 && (
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
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Text type="secondary" className="text-xs">
            <strong>Note:</strong> First and last coordinates should be the same
            to close the polygon. The polygon has {coordinates.length}{" "}
            coordinates.
            {coordinates.length >= 4 &&
            coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
            coordinates[0][1] === coordinates[coordinates.length - 1][1] ? (
              <span className="text-green-600 ml-2">✓ Polygon is closed</span>
            ) : (
              <span className="text-orange-600 ml-2">
                ⚠ Polygon is not closed
              </span>
            )}
          </Text>
        </div>
      </div>
    );
  };

  const renderGeometry = ({ values, setFieldValue }) => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <CoordinateInput
            coordinates={values.geometry.coordinates[0]}
            onChange={(coordinates) => {
              setFieldValue("geometry.coordinates", [coordinates]);
            }}
            label="Polygon Coordinates"
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
          <EditOutlined className="mr-2" />
          Edit Polygon
        </Title>
        <Text type="secondary">
          Update polygon information and visual properties
        </Text>
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
                        Update Polygon
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
