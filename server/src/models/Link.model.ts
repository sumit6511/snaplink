import { HydratedDocument, Model, Schema, Types, model } from 'mongoose';

export interface ILink {
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  qrCode?: string;
  clicks: number;
  owner: Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILinkVirtuals {
  isExpired: boolean;
}

export type LinkDocument = HydratedDocument<ILink, ILinkVirtuals>;

type LinkModel = Model<ILink, unknown, unknown, ILinkVirtuals>;

const ALIAS_PATTERN = /^[a-zA-Z0-9_-]+$/;

const linkSchema = new Schema<ILink, LinkModel>(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
      maxlength: 2048,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customAlias: {
      type: String,
      trim: true,
      minlength: [3, 'Custom alias must be at least 3 characters'],
      maxlength: [50, 'Custom alias must be at most 50 characters'],
      match: [ALIAS_PATTERN, 'Alias may only contain letters, numbers, hyphens and underscores'],
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    qrCode: {
      type: String,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

linkSchema.index({ owner: 1, createdAt: -1 });

linkSchema.virtual('isExpired').get(function (this: LinkDocument) {
  return Boolean(this.expiresAt && this.expiresAt.getTime() < Date.now());
});

linkSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const obj = ret as unknown as { _id: Types.ObjectId } & Record<string, unknown>;
    const { _id, __v, ...rest } = obj;
    return { id: _id.toString(), ...rest };
  },
});

export const Link = model<ILink, LinkModel>('Link', linkSchema);
