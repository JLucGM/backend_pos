import React from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, getPaginationRowModel, getFilteredRowModel, getExpandedRowModel } from '@tanstack/react-table';
import { useState } from 'react';
import TextInput from './TextInput';
import { Link } from '@inertiajs/react';
import { Popover, PopoverButton, PopoverPanel, Select } from '@headlessui/react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, MagnifyingGlassIcon, MinusIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import PDFDocuments from './PDF/PDFDocuments';

export default function DataTable({ data, columns, routeEdit = null, routeDestroy = null, PDFComponent, editPermission, deletePermission, downloadPdfPermission, permissions }) {
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

    const hasPermission = (perm) => {
        return permissions.some(permission => permission.name === perm);
    };

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

            <table className="w-full  border-collapse border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hover:border-collapse my-2">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id}
                                            className="cursor-pointer border-slate-300 border px-6 py-3 "
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <span className="flex items-center">
                                                {header.column.columnDef.header}
                                                {{
                                                    'asc': <ChevronUpIcon className=" size-4" />,
                                                    'desc': <ChevronDownIcon className=" size-4" />
                                                }
                                                [
                                                    header.column.getIsSorted() ?? null
                                                ]}
                                            </span>

                                        </th>
                                    ))
                                }

                                <th key="acciones" className="border-slate-300 border px-6 py-3 w-20">
                                    Acciones
                                </th>
                            </tr>
                        ))
                    }
                </thead>

                <tbody>
                    {
                        table.getRowModel().rows?.map((row) => (
                            <React.Fragment key={row.original.id}>
                                <tr className="bg-white border dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-900">

                                    {
                                        row.getVisibleCells().map((cell, index) => (
                                            <td key={index} className="capitalize  border-slate-200 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))
                                    }

                                    <td key="acciones" className="flex justify-end space-x-4 capitalize border-slate-200 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {columns.find((column) => column.accessorKey === 'id').expanded && (
                                            <Button
                                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                onClick={() => row.toggleExpanded()}
                                            >
                                                {row.getIsExpanded() ? <MinusIcon className='size-4' /> : <PlusIcon className='size-4' />}
                                            </Button>
                                        )}
                                        {/* {PDFComponent && (
                                            <PDFDownloadLink onClick={console.log(row)} document={<PDFComponent data={row.original} />} fileName='pfdprueba1.pdf'>
                                                <Button
                                                    className='inline-flex items-center px-4 py-2 bg-orange-800 dark:bg-orange-500 border border-transparent rounded-full font-semibold text-xs text-white dark:text-gray-200 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150'
                                                >
                                                    PDF
                                                </Button>
                                            </PDFDownloadLink>
                                        )}
                                        {routeEdit && (
                                            <Link
                                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                href={route(routeEdit, [row.original.slug])}
                                            >
                                                <PencilSquareIcon className='size-4' />
                                            </Link>
                                        )}

                                        {routeDestroy && (
                                            <Link
                                                className='inline-flex items-center px-4 py-2 bg-red-800 dark:bg-red-500 border border-transparent  rounded-full font-semibold text-xs text-white dark:text-gray-200 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-red-400 focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150'
                                                href={route(routeDestroy, [row.original.slug])} method='delete' as="button">
                                                <TrashIcon className='size-4' />
                                            </Link>
                                        )} */}
    {(hasPermission(editPermission) || hasPermission(deletePermission)) && (

                                        <Popover className="relative">
                                            <PopoverButton
                                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                            >
                                                Opciones
                                            </PopoverButton>
                                            <PopoverPanel anchor="bottom" className="flex flex-col space-y-2 p-1 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 ">
                                                {/* {hasPermission(downloadPdfPermission) && PDFComponent && (
                                                    <PDFDownloadLink onClick={console.log(row)} document={<PDFComponent data={row.original} />} fileName='pfdprueba1.pdf'>
                                                        <Button className="w-full text-left">
                                                            Descargar PDF
                                                        </Button>
                                                    </PDFDownloadLink>
                                                )} */}
                                                {hasPermission(editPermission) && (
                                                    <Link href={route(routeEdit, [row.original.slug])} className="flex w-full text-left hover:bg-gray-200 hover:rounded-md p-2">
                                                        <PencilSquareIcon className='size-5' /> Editar
                                                    </Link>
                                                )}
                                                {hasPermission(deletePermission) && (
                                                    <Link
                                                        className="flex w-full text-left text-red-600 hover:bg-red-200 hover:rounded-md p-2"
                                                        // onClick={() => console.log('Delete clicked for:', row.original.slug)}
                                                        href={route(routeDestroy, [row.original.slug])} method='delete' as="button">
                                                        <TrashIcon className='size-5' /> Eliminar 
                                                    </Link>
                                                )}
                                            </PopoverPanel>
                                        </Popover>
    )}
                                    </td>
                                </tr>
                                {
                                    row.getIsExpanded() && (
                                        <tr key={`expanded-${row.original.id}`}>
                                            <td colSpan={row.getVisibleCells().length + 1} className="p-4">
                                                {columns.find((column) => column.accessorKey === 'id').expanded(row)}
                                            </td>
                                        </tr>
                                    )
                                }
                            </React.Fragment>
                        ))
                    }
                </tbody>
            </table>

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

                    <span className='flex items-center mx-1'>
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
                        <span className='w-16 ml-1'>of {table.getPageCount()}</span>
                    </span>


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
