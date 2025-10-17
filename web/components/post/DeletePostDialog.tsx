"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import DeletePostSuccessDialog from "../DeleteSuccessDialog";

interface DeletePostDialogProps {
    id: number;
    show: boolean;
    onClose: () => void;
}

export default function DeletePostDialog({ id, show, onClose }: DeletePostDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const res = await api.delete<ApiResponse>(`posts/${id}`);
            if (res.data.error) {
                toast.error(res.data.message ?? "Failed")
                return;
            }
            toast.success(res.data.data.message)
            setIsDeleted(true);
            onClose();
        } catch (error) {
            toast.error("Unable to delete post, an error occurred..")
            console.error("Error deleting:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleDelete();
        }
    };

    return (
        <>
            <Dialog open={show} onClose={onClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-5xl bg-[#0f1419] border border-[#14F1D9]/30 rounded-3xl shadow-2xl shadow-[#14F1D9]/10">
                        <div className="p-6">
                            <div className="flex gap-4 flex-col">
                                <h1 className="text-xl font-normal text-zinc-400">Delete Post</h1>
                                <p className="text-sm font-normal text-zinc-200">Once you delete this post, it can not be undone..</p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div> </div>

                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-3 bg-dark border border-teal text-white px-6 py-3 rounded-full hover:bg-grey-800 transition-colors font-semibold"
                                >
                                    <span className="w-12 h-12 bg-light-teal text-black rounded-full flex items-center justify-center">
                                        <ArrowRight size={24} />
                                    </span>
                                    <span className="text-sm font-bold">{isDeleting ? "Deleting.." : "Yes, Delete"}</span>
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <DeletePostSuccessDialog isOpen={isDeleted} onClose={() => setIsDeleted(false)} />
        </>
    );
}
