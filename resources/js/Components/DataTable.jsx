import React from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, getPaginationRowModel, getFilteredRowModel, getExpandedRowModel } from '@tanstack/react-table';
import { useState } from 'react';
import TextInput from './TextInput';
import { Select } from '@headlessui/react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, MagnifyingGlassIcon, MinusIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function DataTable({ data, columns
}) {
    const [filtering, setFiltering] = useState("");
    const [sorting, setSorting] = useState([]);
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter: filtering,
            sorting
        },
        onSortingChange: setSorting,
        initialState: {
            pagination: {
                pageSize: 10,
            }
        },
        onGlobalFilterChange: setFiltering,

    })

    return (
        <>
            <div className="relative mt-2 rounded-md shadow-sm ">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                        className='size-4'
                    />
                </div>
                <TextInput
                    type="text"
                    value={filtering}
                    className="mt-1 block w-2/5 py-1.5 pl-7 "
                    onChange={(e) => setFiltering(e.target.value)}
                />
            </div>

            <Table className="my-4">
                <TableHeader className="">
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <TableHead key={header.id}
                                            className="cursor-pointer px-6 py-3 "
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center">
                                                {header.column.columnDef.header}
                                                {{
                                                    'asc': <ChevronUpIcon className=" size-4" />,
                                                    'desc': <ChevronDownIcon className=" size-4" />
                                                }
                                                [
                                                    header.column.getIsSorted() ?? null
                                                ]}
                                            </div>

                                        </TableHead>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableHeader>

                <TableBody>
                    {
                        table.getRowModel().rows?.map((row) => (
                            <React.Fragment key={row.original.id}>
                                <TableRow>
                                    {
                                        row.getVisibleCells().map((cell, index) => (
                                            <TableCell key={index} className="capitalize px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                                {
                                    row.getIsExpanded() && (
                                        <TableRow key={`expanded-${row.original.id}`}>
                                            <TableCell colSpan={row.getVisibleCells().length + 1} className="p-4">
                                                {columns.find((column) => column.accessorKey === 'id').expanded(row)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </React.Fragment>
                        ))
                    }
                </TableBody>
            </Table>

            <div className="flex justify-between ">
                <Select
                    className={' border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-3xl shadow-sm'}
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[5, 10, 20, 30].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </Select>

                <div className="flex">
                    <Button
                        variant="ghost"
                        className={'disabled:opacity-30'}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronDoubleLeftIcon
                            className='size-4'
                        />
                    </Button>

                    <Button
                        variant="ghost"
                        className={'disabled:opacity-30'}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeftIcon
                            className='size-4'
                        />
                    </Button>

                    <div className='flex items-center mx-1'>
                        <TextInput
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className={'w-16 border'}
                        />
                        <div className='w-16 ml-1'>of {table.getPageCount()}</div>
                    </div>

                    <Button
                        variant="ghost"
                        className={'disabled:opacity-30'}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRightIcon
                            className='size-4'
                        />
                    </Button>

                    <Button
                        variant="ghost"
                        className={'disabled:opacity-30'}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronDoubleRightIcon
                            className='size-4'
                        />
                    </Button>
                </div>
            </div>

        </>
    );
}
