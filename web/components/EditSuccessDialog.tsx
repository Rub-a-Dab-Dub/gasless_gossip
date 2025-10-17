"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { CheckCircle2, ArrowRight, CheckCircle } from "lucide-react";

interface EditSuccessDialogProps {
    action: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditSuccessDialog({
    action,
    isOpen,
    onClose,
}: EditSuccessDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-100">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Full-screen container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-3xl bg-linear-to-b bg-lime-900/20  rounded-3xl shadow-2xl overflow-hidden border border-lime-600">
                    <div className="">
                        {/* Success Banner */}
                        <div className="flex items-center justify-center gap-2 mb-6 bg-lime-800 text-lime-100 py-4 px-6">
                            <CheckCircle2 size={24} className="" />
                            <p className="text-lg">
                                Action completed
                            </p>
                        </div>

                        {/* Character and XP Display */}
                        <div className="flex flex-col items-center my-14">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <div className="text-lime-600">
                                    <CheckCircle size={96} />
                                </div>
                            </div>

                            {/* Message */}
                            <h2 className="text-2xl text-white font-semibold mb-2">
                                Your {action} has been updated
                            </h2>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pb-10">
                            <div className="flex justify-center items-center w-full space-x-4">
                                {/* Continue Button */}
                                <button
                                    onClick={onClose}
                                    className=" flex items-center px-28 justify-center gap-3 bg-lime-600 text-lime-200 py-4 rounded-full hover:bg-lime-700 transition-colors font-semibold text-lg"
                                >
                                    <span>Continue</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
