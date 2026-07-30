import { HydratedDocument, Model, Schema, Types, model } from 'mongoose';

export const DEVICE_TYPES = ['desktop', 'mobile', 'tablet', 'bot', 'unknown'] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface IClickEvent {
  link: Types.ObjectId;
  browser: string;
  os: string;
  device: DeviceType;
  country: string;
  ip: string;
  referrer: string;
  timestamp: Date;
}

export type ClickEventDocument = HydratedDocument<IClickEvent>;

type ClickEventModel = Model<IClickEvent>;

const clickEventSchema = new Schema<IClickEvent, ClickEventModel>({
  link: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
    index: true,
  },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  device: { type: String, enum: DEVICE_TYPES, default: 'unknown' },
  country: { type: String, default: 'Unknown' },
  ip: { type: String, required: true },
  referrer: { type: String, default: 'Direct' },
  timestamp: { type: Date, default: Date.now },
});

clickEventSchema.index({ link: 1, timestamp: -1 });

clickEventSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as { _id: Types.ObjectId } & Record<string, unknown>;
    const { _id, __v, ...rest } = obj;
    return { id: _id.toString(), ...rest };
  },
});

export const ClickEvent = model<IClickEvent, ClickEventModel>('ClickEvent', clickEventSchema);
