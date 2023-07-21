from db import db


class ReviewModel(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(50), nullable=False)
    rate = db.Column(db.Float, nullable=False)

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'review': self.review_text,
            'rate': self.rate
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def average_rate_by_id(cls, room_id):
        reviews_list = cls.query.filter_by(room_id = room_id).all()
        rate_list = [review.rate for review in reviews_list]
        if rate_list:
            return sum(rate_list) / len(rate_list)
        return 0

    @classmethod
    def find_by_room_id(cls, room_id):
        return cls.query.filter_by(room_id = room_id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
