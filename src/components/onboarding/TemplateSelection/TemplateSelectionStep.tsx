import React from "react";
import { useQuery } from "react-query";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useAuth } from "../../../context/AuthContext";
import {
  Card,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import api from "../../../services/api";

interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

export const TemplateSelectionStep: React.FC = () => {
  // Get auth state
  const { user } = useAuth();

  // Get onboarding actions and state
  const { saveTemplate, currentStep, templateSelection, goToStep, isLoading } =
    useOnboarding();

  // Fetch templates using React Query
  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>(
    "templates",
    async () => {
      const response = await api.get("/templates");
      return response.data;
    }
  );

  const handleTemplateSelect = async (templateId: string) => {
    try {
      await saveTemplate(templateId);
      goToStep(currentStep + 1);
    } catch (error) {
      console.error("Failed to save template:", error);
      // You might want to show an error message here
    }
  };

  if (templatesLoading || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Select Your Onboarding Template
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Welcome {user?.name}! Choose the template that best fits your service
        provider onboarding needs.
      </Typography>

      <Grid container spacing={3}>
        {templates?.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card
              sx={{
                p: 2,
                border:
                  templateSelection === template.id
                    ? "2px solid #2196f3"
                    : "none",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <Box sx={{ mb: 2 }}>
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                {template.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>

              <Button
                variant={
                  templateSelection === template.id ? "contained" : "outlined"
                }
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {templateSelection === template.id
                  ? "Selected"
                  : "Select Template"}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => goToStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => goToStep(currentStep + 1)}
          disabled={!templateSelection}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
