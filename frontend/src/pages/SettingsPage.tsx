import axios from "axios";
import * as React from "react";
import {useState} from "react";

export default function () {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);

        function changePassword(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        axios.post("/api/auth/change-password", {
            currentPassword,
            newPassword
        })
            .then(() => {
                alert("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
            })
            .catch(() => {
                alert("Current password incorrect");
            })
            .finally(() => setSaving(false));
    }


    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold text-purple-800 space-x-6">Settings</h3>
            Any more ideas for settings?

            <form onSubmit={changePassword} className="max-w-md space-y-4 mt-5">
                <h3 className="text-lg font-semibold text-purple-800">
                    Change Password
                </h3>

                <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <button
                    disabled={saving}
                    className="px-4 py-2 bg-purple-700 text-white rounded-md disabled:opacity-50"
                >
                    Change Password
                </button>
            </form>

        </div>
    )
}