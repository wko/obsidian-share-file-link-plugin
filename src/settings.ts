import { App, PluginSettingTab, Setting } from "obsidian";
import LinkSharerPlugin from "./main";

export interface LinkSharerSettings {
	githubPagesUrl: string;
	vaultNameOverride: string;
}

export const DEFAULT_SETTINGS: LinkSharerSettings = {
	githubPagesUrl: 'https://wko.github.io/obsidian-share-file-link-plugin',
	vaultNameOverride: ''
};

export class LinkSharerSettingTab extends PluginSettingTab {
	plugin: LinkSharerPlugin;

	constructor(app: App, plugin: LinkSharerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Link sharer").setHeading();

		new Setting(containerEl)
			.setName("GitHub pages URL")
			.setDesc(
				"Base URL for your GitHub Pages redirect page (without /open.html)",
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"https://username.github.io/obsidian-link-sharer",
					)
					.setValue(this.plugin.settings.githubPagesUrl)
					.onChange(async (value) => {
						// Remove trailing slash if present
						this.plugin.settings.githubPagesUrl = value.replace(
							/\/$/,
							"",
						);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Vault name override")
			.setDesc(
				"Override the vault name used in links. Leave empty to use the actual vault name.",
			)
			.addText((text) =>
				text
					.setPlaceholder("My vault")
					.setValue(this.plugin.settings.vaultNameOverride)
					.onChange(async (value) => {
						this.plugin.settings.vaultNameOverride = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}