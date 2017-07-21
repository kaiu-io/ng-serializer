import { inject, TestBed } from '@angular/core/testing';
import { NgSerializerModule } from '../src';
import { NgSerializerService } from '../src/ng-serializer.service';
import { DiscriminatorProperty } from '@kaiu/serializer';
import { expect } from 'chai';

@DiscriminatorProperty('discriminator')
class Foo {
    discriminator: string;

    bar: string;

    public getBar(): string {
        return this.bar;
    }
}

class FooChild extends Foo {
    public getBar(): string {
        return 'child-' + this.bar;
    }
}

class FooChildTwo extends Foo {
    public getBar(): string {
        return 'child2-' + this.bar;
    }
}

describe('Serializer tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgSerializerModule.forRoot([
                    {
                        parent: Foo,
                        children: {
                            'child': FooChild
                        }
                    }
                ])
            ]
        });
    });

    it('Should be able to call service methods', inject([NgSerializerService], (service: NgSerializerService) => {
        expect(service.deserialize<Foo>({bar: 'baz'}, Foo).getBar()).to.eq('baz');
    }));

    it('Should be able to use provided configuration', inject([NgSerializerService], (service: NgSerializerService) => {
        expect(service.deserialize<Foo>({discriminator: 'child', bar: 'baz'}, Foo).getBar()).to.eq('child-baz');
    }));

    describe('ForChild test', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NgSerializerModule.forChild([
                        {
                            parent: Foo,
                            children: {
                                'child2': FooChildTwo
                            }
                        }
                    ])
                ]
            });
        });

        it('Should be able to use forChild configuration', inject([NgSerializerService], (service: NgSerializerService) => {
            expect(service.deserialize<Foo>({discriminator: 'child2', bar: 'baz'}, Foo).getBar()).to.eq('child2-baz');
        }));
    });
});
