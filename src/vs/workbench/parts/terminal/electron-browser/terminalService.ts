/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {TPromise} from 'vs/base/common/winjs.base';
import {IPanelService} from 'vs/workbench/services/panel/common/panelService';
import {IPartService} from 'vs/workbench/services/part/common/partService';
import {ITerminalService, TERMINAL_PANEL_ID} from 'vs/workbench/parts/terminal/electron-browser/terminal';
import {TerminalPanel} from 'vs/workbench/parts/terminal/electron-browser/terminalPanel';

export class TerminalService implements ITerminalService {
	public serviceId = ITerminalService;

	constructor(
		@IPanelService private panelService: IPanelService,
		@IPartService private partService: IPartService
	) {
	}

	public focus(): TPromise<any> {
		return this.panelService.openPanel(TERMINAL_PANEL_ID, true);
	}

	public toggle(): TPromise<any> {
		const panel = this.panelService.getActivePanel();
		if (panel && panel.getId() === TERMINAL_PANEL_ID) {
			this.partService.setPanelHidden(true);

			return TPromise.as(null);
		}

		return this.panelService.openPanel(TERMINAL_PANEL_ID, true);
	}

	public createNew(): TPromise<any> {
		let panel = this.panelService.getActivePanel();
		if (!panel || panel.getId() !== TERMINAL_PANEL_ID) {
			return this.toggle().then(() => {
				panel = this.panelService.getActivePanel();
				return (<TerminalPanel>panel).createNewTerminalInstance();
			});
		}
		return (<TerminalPanel>panel).createNewTerminalInstance();
	}
}