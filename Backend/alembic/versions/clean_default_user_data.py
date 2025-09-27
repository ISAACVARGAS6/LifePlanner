"""clean_default_user_data

Revision ID: clean_default_user_data
Revises: c23411b5bd1a
Create Date: 2025-01-27 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'clean_default_user_data'
down_revision: Union[str, None] = 'c23411b5bd1a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Eliminar todos los proyectos que pertenecen al usuario por defecto
    op.execute("DELETE FROM projects WHERE user_id = 1")
    
    # Eliminar el usuario por defecto
    op.execute("DELETE FROM users WHERE id = 1")
    
    # Resetear el autoincrement de la tabla users (solo si la tabla existe)
    try:
        op.execute("DELETE FROM sqlite_sequence WHERE name='users'")
    except:
        pass  # La tabla sqlite_sequence puede no existir


def downgrade() -> None:
    """Downgrade schema."""
    # Recrear el usuario por defecto
    op.execute("INSERT INTO users (id, username, device_id, created_at, updated_at) VALUES (1, 'default_user', 'default_device', datetime('now'), datetime('now'))")
    
    # Nota: No podemos recuperar los proyectos eliminados
    pass
