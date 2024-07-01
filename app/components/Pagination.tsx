"use client";
import React from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, DropdownMenu, Flex, Select, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { IssueQuery } from "../issues/list/IssueTable";

interface Props {
    itemCount: number;
    pageSize: number;
    currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageCount = Math.ceil(itemCount / pageSize);

    //if (pageCount <= 1) return null;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push("?" + params.toString());
    };

    return (
        <Flex justify="between">
            <Flex align="center" gap="2">
                <Text size="2">
                    Page {currentPage} of {pageCount}
                </Text>
                <Button
                    color="gray"
                    variant="soft"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    <DoubleArrowLeftIcon />
                </Button>
                <Button
                    color="gray"
                    variant="soft"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ChevronLeftIcon />
                </Button>
                <Button
                    color="gray"
                    variant="soft"
                    disabled={currentPage === pageCount}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <ChevronRightIcon />
                </Button>
                <Button
                    color="gray"
                    variant="soft"
                    disabled={currentPage === pageCount}
                    onClick={() => handlePageChange(pageCount)}
                >
                    <DoubleArrowRightIcon />
                </Button>
            </Flex>

            <Flex gap="2" align="center">
                <Text as="p">Page Size</Text>
                <Select.Root
                    defaultValue={pageSize.toString()}
                    onValueChange={(pageSize) => {
                        const params = new URLSearchParams(searchParams);

                        if (pageSize && !params.get("pageSize")) {
                            params.append("pageSize", pageSize);
                            params.delete("page");
                        } else {
                            params.set("pageSize", pageSize);
                            params.delete("page");
                        }

                        const query = params.size
                            ? "?" + params.toString()
                            : null;
                        router.push("/issues/list" + query);
                    }}
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="10">10</Select.Item>
                        <Select.Item value="25">25</Select.Item>
                        <Select.Item value="50">50</Select.Item>
                        <Select.Item value="100">100</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>
        </Flex>
    );
};

export default Pagination;
