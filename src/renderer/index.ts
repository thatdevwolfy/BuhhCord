/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Buhhcord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./themedSplash";
import "./ipcCommands";
import "./appBadge";
import "./patches";
import "./fixes";
import "./arrpc";

export * as Components from "./components";

import SettingsUi from "./components/settings/Settings";
import { VesktopLogger } from "./logger";
import { Settings } from "./settings";
export { Settings };

import type SettingsPlugin from "@buhhcord/types/plugins/_core/settings";

VesktopLogger.log("read if cute :3");
VesktopLogger.log("Vesktop v" + VesktopNative.app.getVersion());

const customSettingsSections = (Buhhcord.Plugins.plugins.Settings as any as typeof SettingsPlugin).customSections;

customSettingsSections.push(() => ({
    section: "Vesktop",
    label: "Vesktop Settings",
    element: SettingsUi,
    className: "vc-vesktop-settings"
}));
