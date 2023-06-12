from db import db


class reservationsModel(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)  # Reservation ID
    date_from = db.Column(db.Date, primaty_key=False)  # Arrival date
    date_to = db.Column(db.Date, primaty_key=False)  # Departure date
    user_id = db.Column(db.Integer, primary_key=False)  # User ID
    room_id = db.Column(db.Integer, primary_key=False)  # Apartment ID

    def json(self):
        return {
            'id': self.id,
            'date_from': self.date_from,
            'date_to': self.date_to,
            'user_id': self.user_id,
            'room_id': self.room_id
        }

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
