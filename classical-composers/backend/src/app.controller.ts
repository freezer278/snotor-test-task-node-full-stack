import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import { AppService } from "./app.service";
import {Composer, ComposerContact} from './types/composer';

@Controller('composers')
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	@Get()
	getComposers(): Composer[] {
		return this.appService.getComposers();
	}

	@Get(':id/contact')
	getContact(@Param() params: any): ComposerContact {
		const contact = this.appService.getContact(params.id);
		if (!contact) {
			throw new NotFoundException();
		}

		return contact;
	}
}
