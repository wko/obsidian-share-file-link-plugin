import {Notice, Plugin, TFile} from 'obsidian';
import {DEFAULT_SETTINGS, LinkSharerSettings, LinkSharerSettingTab} from "./settings";

export default class LinkSharerPlugin extends Plugin {
	settings: LinkSharerSettings;

	async onload() {
		await this.loadSettings();

		// Register file-menu context menu item
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (!(file instanceof TFile)) return;

				menu.addItem((item) => {
					item
						.setTitle('Copy shareable link')
						.setIcon('link')
						.onClick(async () => {
							const shareableLink = this.generateShareableLink(file);
							await navigator.clipboard.writeText(shareableLink);
							new Notice('Shareable link copied to clipboard!');
						});
				});
			})
		);

		// Add command to copy shareable link for active file
		this.addCommand({
			id: 'copy-shareable-link',
			name: 'Copy shareable link for active file',
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					if (!checking) {
						const shareableLink = this.generateShareableLink(activeFile);
						void navigator.clipboard.writeText(shareableLink);
						new Notice('Shareable link copied to clipboard!');
					}
					return true;
				}
				return false;
			}
		});

		// Add settings tab
		this.addSettingTab(new LinkSharerSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<LinkSharerSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Generate a shareable HTTPS link for a file
	 */
	generateShareableLink(file: TFile): string {
		const obsidianURI = this.createObsidianURI(file);
		const encodedURI = this.base64UrlEncode(obsidianURI);
		return `${this.settings.githubPagesUrl}/open.html?link=${encodedURI}`;
	}

	/**
	 * Create an Obsidian URI for a file
	 */
	createObsidianURI(file: TFile): string {
		const vaultName = this.settings.vaultNameOverride || this.app.vault.getName();
		const filePath = file.path;
		return `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(filePath)}`;
	}

	/**
	 * URL-safe Base64 encoding (RFC 4648)
	 * Encodes a string to URL-safe Base64 by:
	 * 1. UTF-8 encoding the string
	 * 2. Converting to standard Base64
	 * 3. Replacing + with -, / with _, and removing = padding
	 */
	base64UrlEncode(str: string): string {
		// UTF-8 encode the string to bytes
		const encoder = new TextEncoder();
		const bytes = encoder.encode(str);
		// Convert bytes to binary string for btoa
		const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
		// Convert to base64
		const base64 = btoa(binString);
		// Make it URL-safe: replace + with -, / with _, remove = padding
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	}
}