import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db } from "../firebase";
import TaskForm from "./TaskForm";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Grid,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import styled from "styled-components";

const TaskCard = styled(Card)`
    border-radius: 14px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover {
        transform: scale(1.01);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

export default function TaskList({ user, search, categoryFilter }) {
    const [tasks, setTasks] = useState([]);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            const fetchedTasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(fetchedTasks);
        });

        return () => unsub();
    }, [user]);

    const addOrUpdateTask = async (data) => {
        const taskData = {
            ...data,
            uid: user.uid,
            createdAt: new Date(),
        };

        if (editing) {
            await updateDoc(doc(db, "tasks", editing.id), taskData);
            setEditing(null);
        } else {
            await addDoc(collection(db, "tasks"), taskData);
        }
    };

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, "tasks", id));
    };

    const toggleCompletion = async (task) => {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, { completed: !task.completed });
    };

    const filteredTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
        )
        .filter((task) =>
            categoryFilter ? task.category === categoryFilter : true
        )
        .sort((a, b) => {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

    return (
        <div>
            <TaskForm onSave={addOrUpdateTask} editingTask={editing} />

            <Grid container spacing={2}>
                {filteredTasks.map((task) => (
                    <Grid item xs={12} sm={6} key={task.id}>
                        <TaskCard
                            elevation={3}
                            sx={{
                                opacity: task.completed ? 0.6 : 1,
                                textDecoration: task.completed ? "line-through" : "none",
                            }}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography variant="h6">{task.title}</Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={task.completed}
                                                onChange={() => toggleCompletion(task)}
                                            />
                                        }
                                        label="Done"
                                    />
                                </Stack>

                                <Typography variant="body2" color="text.secondary">
                                    {task.description}
                                </Typography>

                                <Typography variant="caption" color="primary">
                                    Priority: {task.priority} | Category: {task.category}
                                </Typography>

                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button size="small" onClick={() => setEditing(task)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </CardContent>
                        </TaskCard>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
