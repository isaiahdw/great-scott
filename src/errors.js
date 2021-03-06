/* jshint latedef:false */
'use strict';

const DUP_KEY = /^duplicate key value violates unique constraint/i;
const NOT_NULL = /^null value in column ".*" violates not-null constraint$/i;
const FOREIGN_KEY = /^insert or update on table ".*" violates foreign key constraint/;
const NO_RELATION = /^relation ".*" does not exist$/i;

class PostgresError extends Error {
  constructor(message, code) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
  }

  static factory(err) {
    if (err.message.match(DUP_KEY)) {
      return UniqueConstraintError.fromError(err);
    } else if (err.message.match(NOT_NULL)) {
      return NotNullConstraintError.fromError(err);
    } else if (err.message.match(FOREIGN_KEY)) {
      return ForeignKeyConstraintError.fromError(err);
    } else if (err.message.match(NO_RELATION)) {
      return RelationNotFoundError.fromError(err);
    }

    return err;
  }
}

class ForeignKeyConstraintError extends PostgresError {
  static fromError(err) {
    let newErr = new ForeignKeyConstraintError(err.message, err.code);
    newErr.detail = err.detail;
    newErr.table = err.table;
    newErr.column = err.column;
    newErr.constraint = err.constraint;
    return newErr;
  }
}

class NotNullConstraintError extends PostgresError {
  static fromError(err) {
    let newErr = new NotNullConstraintError(err.message, err.code);
    newErr.detail = err.detail;
    newErr.table = err.table;
    newErr.column = err.column;
    return newErr;
  }
}

class UniqueConstraintError extends PostgresError {
  static fromError(err) {
    let newErr = new UniqueConstraintError(err.message, err.code);
    newErr.detail = err.detail;
    newErr.table = err.table;
    newErr.constraint = err.constraint;
    return newErr;
  }
}

class RelationNotFoundError extends PostgresError {
  static fromError(err) {
    return new RelationNotFoundError(err.message, err.code);
  }
}

class NotFoundError extends PostgresError {
}

export default {
  PostgresError,
  ForeignKeyConstraintError,
  NotNullConstraintError,
  UniqueConstraintError,
  NotFoundError,
  RelationNotFoundError,
};
