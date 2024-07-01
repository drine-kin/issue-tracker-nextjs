"use client";
import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";

import React  from "react";
import toast, { Toaster } from "react-hot-toast";

const IssueStatus = ({ issue }: { issue: Issue }) => {
    const statuses = Object.values(Status);

    const router = useRouter();

    const changeStatus = (status: string) => {
        axios
            .patch("/api/issues/" + issue.id, {
                status: status,
            })
            .then(() => {
                router.refresh();
            })
            .catch(() => {
                toast.error("Changes could not be saved.");
            });
    };

    return (
        <>
            <Select.Root
                value={issue.status}
                onValueChange={changeStatus}
            >
                <Select.Trigger placeholder="Assign..." />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Status</Select.Label>
                        {statuses?.map((status) => (
                            <Select.Item key={status} value={status}>
                                {status}
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Toaster />
        </>
    );
};

export default IssueStatus;
