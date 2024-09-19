import {Injectable} from '@nestjs/common';
import * as composers from './data/composers.json';
import * as contacts from './data/contacts.json';
import {Composer, ComposerContact} from './types/composer';

@Injectable()
export class AppService {
    getComposers(): Composer[] {
        return composers;
    }

    getContact(composerId: number): ComposerContact | null {
        return contacts.find((contact: ComposerContact) => {
            return contact.id == composerId;
        });
    }
}
