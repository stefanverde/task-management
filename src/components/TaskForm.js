import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Paper, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel } from "@mui/material";
import styled from "styled-components";

const FormWrapper = styled(Paper)`
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
`;

export default function TaskForm({ onSave, editingTask }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({});
    const [networkError, setNetworkError] = useState("");

    const [priority, setPriority] = useState("Medium");
    const [category, setCategory] = useState("Personal");
    // const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDesc(editingTask.description);
        } else {
            setTitle("");
            setDesc("");
        }
        setErrors({});
    }, [editingTask]);

    const validate = () => {
        const newErrors = {};
        let valid = true;

        if (!title.trim()) {
            newErrors.title = "Title is required";
            valid = false;
        }

        if (!desc.trim()) {
            newErrors.description = "Description is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setNetworkError("");  // Reset error

        try {
            await onSave({ title: title.trim(), description: desc.trim(), priority:priority, category:category, completed: false });
            setTitle("");
            setDesc("");
            setErrors({});
        } catch (error) {
            setNetworkError("Error while saving the task. Please try again.");
        }
    };

    return (
        <FormWrapper elevation={3}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priority}
                            label="Priority"
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="Work">Work</MenuItem>
                            <MenuItem value="Personal">Personal</MenuItem>
                            <MenuItem value="School">School</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Task Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <Button variant="contained" color="success" type="submit" size="large">
                        {editingTask ? "Update Task" : "Add Task"}
                    </Button>
                    {networkError && (
                        <Typography color="error" variant="body2" align="center">
                            {networkError}
                        </Typography>
                    )}
                </Stack>
            </form>
        </FormWrapper>
    );
}
