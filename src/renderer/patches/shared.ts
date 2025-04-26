/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Buhhcord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Patch } from "@buhhcord/types/utils/types";

window.VesktopPatchGlobals = {};

interface PatchData {
    patches: Omit<Patch, "plugin">[];
    [key: string]: any;
}

export function addPatch<P extends PatchData>(p: P) {
    const { patches, ...globals } = p;

    for (const patch of patches) {
        // TODO: Update types
        Buhhcord.Plugins.addPatch(patch, "Vesktop", "VesktopPatchGlobals");
    }

    Object.assign(VesktopPatchGlobals, globals);
}
