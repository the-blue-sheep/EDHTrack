import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PlayerGroupDTO {
    id: number;
    name: string;
    isDefault: boolean;
}

interface CreateGroupDTO {
    name: string;
}

interface UpdateGroupDTO {
    name: string;
}

export default function PlayerGroupsSettings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [groups, setGroups] = useState<PlayerGroupDTO[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [editingNames, setEditingNames] = useState<{ [key: number]: string }>({});

    const loadGroups = () => {
        axios.get<PlayerGroupDTO[]>("/api/groups")
            .then(res => setGroups(res.data))
            .catch(() => toast.error("Failed to load groups"));
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const handleAddGroup = () => {
        if (!newGroupName.trim()) return;

        const dto: CreateGroupDTO = { name: newGroupName.trim() };
        const toasty = toast.loading("Adding group...");
        axios.post("/api/groups", dto)
            .then(() => {
                toast.update(toasty, { render: "Group added", type: "success", isLoading: false, autoClose: 2000 });
                setNewGroupName("");
                loadGroups();
            })
            .catch(() => toast.update(toasty, { render: "Failed to add group", type: "error", isLoading: false, autoClose: 3000 }));
    };

    const handleRenameGroup = (groupId: number) => {
        const newName = editingNames[groupId]?.trim();
        if (!newName) return;

        const dto: UpdateGroupDTO = { name: newName };
        const toasty = toast.loading("Renaming group...");
        axios.put(`/api/groups/${groupId}`, dto)
            .then(() => {
                toast.update(toasty, { render: "Group renamed", type: "success", isLoading: false, autoClose: 2000 });
                setEditingGroupId(null);
                setEditingNames(prev => {
                    const copy = { ...prev };
                    delete copy[groupId];
                    return copy;
                });
                loadGroups();
            })
            .catch(() => toast.update(toasty, { render: "Failed to rename group", type: "error", isLoading: false, autoClose: 3000 }));
    };

    const handleDeleteGroup = (group: PlayerGroupDTO) => {
        if (group.isDefault) {
            toast.info("Default group cannot be deleted");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete the group "${group.name}"?`)) return;

        const toasty = toast.loading("Deleting group...");
        axios.delete(`/api/groups/${group.id}`)
            .then(() => {
                toast.update(toasty, { render: "Group deleted", type: "success", isLoading: false, autoClose: 2000 });
                setGroups(prev => prev.filter(g => g.id !== group.id));
            })
            .catch(() => toast.update(toasty, { render: "Failed to delete group", type: "error", isLoading: false, autoClose: 3000 }));
    };

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
            <h1 className="text-2xl font-bold text-purple-800 mb-4">Settings</h1>

            <div>
                <h3 className="text-xl font-semibold text-purple-800 mb-6">Player Groups</h3>

                <div className="flex gap-2 mb-6 items-center">
                    <input
                        type="text"
                        placeholder="New group name"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        className="border w-1/5 mb-0 px-3 py-2 rounded-md"
                    />
                    <button
                        onClick={handleAddGroup}
                        className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
                    >
                        Add
                    </button>
                </div>

                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Default</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map(group => (
                        <tr key={group.id + group.name}>
                            <td className="border px-4 py-2">
                                {editingGroupId === group.id ? (
                                    <input
                                        type="text"
                                        value={editingNames[group.id] || ""}
                                        onChange={e =>
                                            setEditingNames(prev => ({ ...prev, [group.id]: e.target.value }))
                                        }
                                        className="border px-2 py-1 rounded-md w-full"
                                    />
                                ) : (
                                    group.name
                                )}
                            </td>
                            <td className="border px-4 py-2 text-center">
                                {group.isDefault ? "Yes" : ""}
                            </td>
                            <td className="border px-4 py-2 flex gap-2">
                                {editingGroupId === group.id ? (
                                    <>
                                        <button
                                            onClick={() => handleRenameGroup(group.id)}
                                            className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingGroupId(null)}
                                            className="px-2 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingGroupId(group.id);
                                                setEditingNames(prev => ({ ...prev, [group.id]: group.name }));
                                            }}
                                            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
                                        >
                                            Rename
                                        </button>
                                        {!group.isDefault && (
                                            <button
                                                onClick={() => handleDeleteGroup(group)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={changePassword} className="max-w-md space-y-4 mt-5">
                <h3 className="text-lg font-semibold text-purple-800">Change Password</h3>

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
    );
}
