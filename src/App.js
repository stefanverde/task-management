import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import TaskList from "./components/TaskList";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Slide,
    useScrollTrigger,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
} from "@mui/material";
import styled from "styled-components";

const AppWrapper = styled(Box)`
    min-height: 100vh;
    background: linear-gradient(to right, #fdfbfb, #ebedee);
    padding-top: 5rem;
    padding-bottom: 2rem;
`;

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    return (
        <>
            <HideOnScroll>
                <AppBar elevation={1} color="transparent" position="fixed">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6" fontWeight={700}>
                            Task Manager
                        </Typography>
                        {user && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => signOut(auth)}
                            >
                                Logout
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>

            <AppWrapper>
                <Container maxWidth="sm">
                    {!user ? (
                        <Auth />
                    ) : (
                        <>
                            <Stack spacing={2} mb={3}>
                                <TextField
                                    label="Search Tasks"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    fullWidth
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Filter by Category</InputLabel>
                                    <Select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        label="Filter by Category"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="Work">Work</MenuItem>
                                        <MenuItem value="Personal">Personal</MenuItem>
                                        <MenuItem value="School">School</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>

                            <TaskList
                                user={user}
                                search={search}
                                categoryFilter={categoryFilter}
                            />
                        </>
                    )}
                </Container>
            </AppWrapper>
        </>
    );
}

export default App;
