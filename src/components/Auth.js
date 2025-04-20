import React, { useState } from "react";
import {
    TextField,
    Button,
    Stack,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
} from "@mui/material";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";

const AuthWrapper = styled(Paper)`
    padding: 2.5rem;
    border-radius: 20px;
    margin-top: 3rem;
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

export default function Auth() {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [networkError, setNetworkError] = useState("");

    const validate = () => {
        let valid = true;
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleAuth = async () => {
        if (!validate()) return;

        setNetworkError("");  // Reset error

        try {
            if (mode === "register") {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setNetworkError("This email is already in use.");
            } else if (error.code === 'auth/invalid-email') {
                setNetworkError("Invalid email format.");
            } else if (error.code === 'auth/wrong-password') {
                setNetworkError("Incorrect password.");
            } else {
                setNetworkError("Network error, please try again.");
            }
        }
    };

    return (
        <AuthWrapper elevation={4}>
            <Stack spacing={3}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, value) => value && setMode(value)}
                    fullWidth
                >
                    <ToggleButton value="login">Login</ToggleButton>
                    <ToggleButton value="register">Register</ToggleButton>
                </ToggleButtonGroup>

                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleAuth}
                    sx={{ textTransform: "none" }}
                >
                    {mode === "login" ? "Log In" : "Create Account"}
                </Button>
                {networkError && (
                    <Typography color="error" variant="body2" align="center">
                        {networkError}
                    </Typography>
                )}
            </Stack>
        </AuthWrapper>
    );
}
